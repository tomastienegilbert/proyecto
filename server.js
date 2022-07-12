// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const secretKey = "Shhhh";
const chalk = require("chalk");
const {
    nuevoUsuario,
    obtenerUsuarios,
    editarUsuario,
    nuevaPlaylist,
    obtenerPlaylists,
    editarPlaylist,
    agregarCancion,
    obtenerCanciones,
    editarCancion,
    eliminarCancion,
    vaciarPlaylist,
    playlistUsuario
} = require("./controllers/bbdd.js");



// Server
app.listen(3000, () => console.log(chalk.green.bold("Servidor encendido en puerto 3000!")));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

//2. Servir contenido dinámico con express-handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
        partialsDir: __dirname + "/views/componentes/",
    })
);
app.set("view engine", "handlebars");
    

// Rutas

//1. Crear una API REST con el Framework Express
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

//Renderear vista de ingreso
app.get("/ingreso", (req, res) => {
    res.render("Ingreso");
});

//Renderear vista crear playlist
app.get("/crearplaylist", (req, res) => {
    res.render("CrearPlaylist");
});

//renderear vista editar playlist
app.get("/editarplaylist", (req, res) => {
    res.render("EditarPlaylist");
});

//Renderear vista de Agregar Canciones
app.get("/agregarCanciones", (req, res) => {
        res.render("AgregarCanciones");
 }); 

 //Renderear vista de editar datos de perfil
 app.get("/configPerfil", (req, res) => {
    const { token } = req.query
    jwt.verify(token, secretKey, (err, usuario) => {
    // if (err) {
    //     res.status(500).send({
    //         error: `Algo salió mal...`,
    //         message: err.message,
    //         code: 500
    //     })
    // } else {
        res.render("configPerfil", { usuario });
    // }
    })
 }); 



//registrar nuevo usuario
app.post("/usuarios", async (req, res) => {
    const { email, password, nombre, apellido, fecha_muerte } = req.body;
    console.log(req.body);
    try {
        const usuario = await nuevoUsuario({ email, password, nombre, apellido, fecha_muerte });
        res.redirect("/crearplaylist");
        console.log(req.body);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//Obtener usuarios de la base de datos
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.send(usuarios);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

//obtener playlists de base de datos
app.get("/playlists", async (req, res) => {
    try {
        const playlists = await obtenerPlaylists();
        res.send(playlists);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//obtener canciones de la base de datos
app.get("/canciones", async (req, res) => {
    try {
        const canciones = await obtenerCanciones();
        res.send(canciones);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

// Editar datos de usuario
app.put("/usuarios", async (req, res) => {
    const { email, password, nombre, apellido, fecha_muerte } = req.body;
    const id_usuario = 1;
    try {
        const usuario = await editarUsuario({id_usuario, email, password, nombre, apellido, fecha_muerte });
        res.redirect("/agregarcanciones");
        console.log(req.body);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//crear nueva playlist
app.post("/playlists", async (req, res) => {
    const { nombre_playlist } = req.body;
    const id_usuario = 1;
    console.log(req.body);
    try {
        const playlist = await nuevaPlaylist({ nombre_playlist, id_usuario });
        res.redirect("/agregarCanciones");
        console.log(playlist);   }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

// edtar playlist
app.put("/playlists", async (req, res) => {
    const { nombre_playlist } = req.body;
    const id = 1;
    console.log(req.body);
    try {
        const playlist = await editarPlaylist({ nombre_playlist, id });
        res.redirect("/agregarCanciones");
        console.log(req.body);   }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//agregar canciones
app.post("/canciones", async (req, res) => {
    const { titulo, album, artista, comentario, enlace } = req.body;
    const id_playlist = 1;
    console.log(req.body);
    try {
        const cancion = await agregarCancion({ titulo, album, artista, comentario, enlace, id_playlist });
        res.redirect("/agregarCanciones");
        console.log(cancion);
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});