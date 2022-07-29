// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const secret_key = "secret_key";
const {
    nuevoUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorEmail, 
    editarUsuario,
    nuevaPlaylist,
    obtenerPlaylists,
    obtenerPlaylistporIDUsuario,
    obtenerPlaylistPorID,
    editarPlaylist,
    agregarCancion,
    obtenerCanciones,
    obtenerCancionesPorIDPlaylist,
    actualizarCancion,
    eliminarCancion,
    vaciarPlaylist,
} = require("./controllers/bbdd.js");
const { default: axios } = require("axios");
require('dotenv').config();523        

// Server
app.listen(3000, () => console.log(chalk.green.bold("Servidor encendido en puerto 3000!")));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use(express.static(__dirname + "/node_modules/axios/dist"));

//middleware de verificacion de token para rutas protegidas
// Middleware para validar el token (rutas protegidas)
const requiereAuth = (req, res, next) => {
    const token = req.headers.authorization;

    // Se verifica si el request posee el header authorization
    if (!token) return res.status(401).json({ error: 'No token provided.' });

    jwt.verify(token, secret_key, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ error: 'Invalid token', token_error: err });
        } else {
            req.user = decodedToken; // id, email, role_id
            next();
        }
    });
}

//2. Servir contenido dinámico con express-handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
        partialsDir: __dirname + "/views/partials/",
    })
);
app.set("view engine", "handlebars");

//Crear una API REST con el Framework Express
app.get("/", async (req, res) => {
    try {
        res.render("Home");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

//Renderear vista registro
app.get("/registro", (req, res) => {
    res.render("Registro");
});

//registrar nuevo usuario con su playlist
app.post("/usuarios", async (req, res) => {
    try {
    const { email, password, nombre, apellido, fecha_muerte, nombre_playlist } = req.body;
    
    //encryptar password con bcrypt
    const encriptarPassword = await bcrypt.hash(password, 10);
    

    const usuario = await nuevoUsuario({ email, password: encriptarPassword, nombre, apellido, fecha_muerte });
    
    const playlist = await nuevaPlaylist({ nombre_playlist, id_usuario: usuario.id_usuario });
    console.log(req.body)
    res.send("/ingreso");
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//api de usuarios
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.send(usuarios);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//api de playlists
app.get("/playlists", async (req, res) => {
    try {
        const playlists = await obtenerPlaylists();
        res.send(playlists);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//4. Implementar seguridad y restricción de recursos o contenido con JWT
app.get("/perfil/:id_usuario", (req, res) => {
    res.render("Perfil", { id_usuario: req.params.id_usuario });
});

//Editar datos de usuario
app.put("/usuarios/:id_usuario", async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { email, password, nombre, apellido, fecha_muerte } = req.body;
        const usuario = await editarUsuario({nombre, apellido, email, password, fecha_muerte}, id_usuario);
        res.send(usuario);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//vista de ingresos
app.get("/ingreso", (req, res) => {
    res.render("Ingreso");
});

//ingreso de usuarios
app.post("/ingresos", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) return res.status(400).send("El email es requerido");
      if (!password) return res.status(400).send("La contraseña es requerida");
  
      // obtener el usuario a partir del correo
      const usuario = await obtenerUsuarioPorEmail(email);
      if (!usuario) {
        return res.status(400).send("Credenciales invalidas");
      }

      //obtener la playlist por id_usuario
      const playlist = await obtenerPlaylistporIDUsuario(usuario.id_usuario);
      if (!playlist) {
        return res.status(400).send("no se encuentra playlist");
    }

  
      const passwordValid = await bcrypt.compare(password, usuario.password);
      if (!passwordValid) {
        return res.status(400).send("Credenciales invalidas");
      }

      // generar el token con id_playlist y usuario
        const token = jwt.sign({ id_playlist: playlist.id_playlist, id_usuario: usuario.id_usuario }, secret_key);
      
        //res con toke, id_playlist, id_usuario e id_playlist borranro la password del usuario
        res.send({
            token,
            usuario,
            playlist
        });
        delete usuario.password;
    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
  });
  
//renderizar vista agregarcanciones verificando token
app.get("/agregarcanciones/:id_playlist", async (req, res) => {
    try {
        //token debe estar en el header
        //requerir aut
        //requiereAuth(req, res);
        const { id_playlist } = req.params;
        const cancionesPlaylist = await obtenerCancionesPorIDPlaylist(id_playlist);

        res.render("AgregarCanciones",{cancionesPlaylist});
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

//agregar canciones
app.post("/canciones", async (req, res) => {
    try {
        const { token, titulo, album, artista, comentario, enlace } = req.body;
        const id_playlist = JSON.stringify(jwt.verify(token, secret_key).id_playlist);
        console.log(id_playlist);
        console.log(req.body);
        const cancion = await agregarCancion({id_playlist: id_playlist, titulo, album, artista, comentario, enlace});
        res.status(200).send(cancion);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//api de usuarios
app.get("/canciones", async (req, res) => {
    try {
        const canciones = await obtenerCanciones();
        res.send(canciones);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

app.put("/canciones/:id_cancion", async (req, res) => {
    const { id_cancion } = req.params
    const { titulo, album, artista, comentario, enlace } = req.body;
    try {
        const cancion = await actualizarCancion({titulo, album, artista, comentario, enlace}, id_cancion);
        console.log(req.body);
        console.log(req.params);
        console.log(cancion)    
        res.send(cancion);
    } catch (error) {
        res.status(500).send({
            error: `Algo salió mal... ${error}`,
            code: 500
        })
    }
});


//eliminar canciones
app.delete("/canciones/:id_cancion", async (req, res) => {
    const { id_cancion } = req.params;
    try {
        await eliminarCancion({id_cancion});
        res.status(200).send("Cancion eliminada");
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//eliminar todas las canciones de una playlist
app.delete("/playlists/:id_playlist", async (req, res) => {
    const { id_playlist } = req.params;
    try {
        await vaciarPlaylist(id_playlist);
        res.status(200).send("Canciones eliminadas");
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});