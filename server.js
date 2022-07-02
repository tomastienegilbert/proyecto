// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const secretKey = "Shhhh";
const chalk = require("chalk");
const {
    newUser,
    getCanciones,
    getSkater,
    updateSkater,
    deleteSkater,
    setSkaterStatus,
} = require("./controllers/bbdd.js");



// Server
app.listen(3000, () => console.log(chalk.green.bold("Servidor encendido en puerto 3000!")));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
// app.use(
//     expressFileUpload({
//         limits: 5000000,
//         abortOnLimit: true,
//         responseOnLimit: "El tamaño de la imagen supera el límite permitido",
//     })
// );
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

//2. Servir contenido dinámico con express-handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
    })
);
app.set("view engine", "handlebars");

// Rutas

//1. Crear una API REST con el Framework Express
app.get("/", async (req, res) => {
    try {
        // const skaters = await getSkaters()
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

//registrar nuevo usuario
app.post("/users", async (req, res) => {
    const { email, password, nombre, apellido, fecha_muerte } = req.body;
    console.log(req.body);
    try {
        const user = await newUser({ email, password, nombre, apellido, fecha_muerte });
        res.redirect("/perfil");
    }
    catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
}
);

//4. Implementar seguridad y restricción de recursos o contenido con JWT
app.get("/perfil", (req, res) => {
    const { token } = req.query
    jwt.verify(token, secretKey, (err, user) => {
        // if (err) {
        //     res.status(500).send({
        //         error: `Algo salió mal...`,
        //         message: err.message,
        //         code: 500
        //     })
        // } else {
            res.render("Perfil", { user });
        // }
    })
});

app.get("/login", (req, res) => {
    res.render("Login");
});

//4. Implementar seguridad y restricción de recursos o contenido con JWT
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const skater = await getSkater(email, password)
        const token = jwt.sign(skater, secretKey)
        res.status(200).send(token)
    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.get("/Admin", async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.render("Admin", { skaters });
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});


// API REST de Skaters

app.get("/skaters", async (req, res) => {

    try {
        const skaters = await getSkaters()
        res.status(200).send(skaters);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

// //3. Ofrecer la funcionalidad Upload File con express-fileupload
// app.post("/registro", async (req, res) => {
//     const skater = req.body;
//     if (Object.keys(req.files).length == 0) {
//         return res.status(400).send("No se encontro ningun archivo en la consulta");
//     }
//     const { files } = req
//     const { foto } = files;
//     const { name } = foto;
//     const pathPhoto = `/uploads/${name}`
//     foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
//         try {
//             if (err) throw err
//             skater.foto = pathPhoto
//             await newSkater(skater);
//             res.status(201).redirect("/login");
//         } catch (e) {
//             console.log(e)
//             res.status(500).send({
//                 error: `Algo salió mal... ${e}`,
//                 code: 500
//             })
//         };

//     });
// })

app.put("/skaters", async (req, res) => {
    const skater = req.body;
    try {
        await updateSkater(skater);
        res.status(200).send("Datos actualizados con éxito");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.put("/skaters/status/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await setSkaterStatus(id, estado);
        res.status(200).send("Estatus de skater cambiado con éxito");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.delete("/skaters/:id", async (req, res) => {
    const { id } = req.params
    try {
        await deleteSkater(id)
        res.status(200).send();
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

