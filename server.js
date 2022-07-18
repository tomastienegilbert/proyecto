// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const {
    nuevoUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorEmail, 
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

// 1) registrar nuevo usuario con su playlist
app.post("/usuarios", async (req, res) => {
    try {
    const { email, password, nombre, apellido, fecha_muerte, nombre_playlist } = req.body;
    
    //encryptar password con bcrypt
    const encriptarPassword = await bcrypt.hash(password, 10);
    

    const usuario = await nuevoUsuario({ email, password: encriptarPassword, nombre, apellido, fecha_muerte });
    
    const playlist = await nuevaPlaylist({ nombre_playlist, id_usuario: usuario.id_usuario });
    res.send("/ingreso");
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

//Renderear vista de ingreso
app.get("/ingreso", (req, res) => {
    res.render("Ingreso");
});

//Ingreso de usuario con token secreto
// 1) registrar nuevo usuario con su playlist
app.post("/ingresos", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        //encryptar password con bcrypt
        //const encriptarPassword = await bcrypt.hash(password, 10);
        

        const usuario = await obtenerUsuarioPorEmail(email);
        if (usuario) {
            const validarPassword = await bcrypt.compare(password, usuario.password);
            if (validarPassword) {
                const token = jwt.sign({ id: usuario.id_usuario }, process.env.SECRET_KEY);
                res.send({ token });
            } else {
                res.send("Contraseña incorrecta");
            }
        } else {
            res.send("Usuario no existe");
        }
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
});

// private routes
app.get("/agregarcanciones", (req, res) => {
    res.render("AgregarCanciones", { requiresAuth: true });
});