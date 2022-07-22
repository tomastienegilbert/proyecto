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
    editarPlaylist,
    agregarCancion,
    obtenerCanciones,
    obtenerCancionesPorIDPlaylist,
    editarCancion,
    eliminarCancion,
    vaciarPlaylist,
} = require("./controllers/bbdd.js");
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
app.get("/perfil", (req, res) => {
    const { token } = req.query
    jwt.verify(token, secretKey, (err, usuario) => {
        if (err) {
            res.status(500).send({
                error: `Algo salió mal...`,
                message: err.message,
                code: 500
            })
        } else {
            res.render("Perfil", { usuario });
        }
    })
});

app.get("/ingreso", (req, res) => {
    res.render("Ingreso");
});

//4. Implementar seguridad y restricción de recursos o contenido con JWT
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

      // generar el token con id_playlist del usuario
      const token = jwt.sign(playlist, secret_key);
      
      res.status(200).send({usuario, token})
    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
  });
  
//renderizar vista agregarcanciones verificando token
app.get("/agregarcanciones", async (req, res) => {
    try {
        const { token } = req.query;
        const id_playlist = JSON.stringify(jwt.verify(token, secret_key).id_playlist);
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

//api de canciones segun id de playlist
app.get("/canciones/:id_playlist", async (req, res) => {
    try {
        const canciones = await obtenerCancionesPorIDPlaylist(req.params.id_playlist);
        res.send(canciones);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});