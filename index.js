const express = require("express");
const {engine} = require("express-handlebars");
const chalk = require("chalk");

const app = express();
const PORT = process.env.PORT || 3000


// motor de plantilla 
app.engine(".hbs", engine({extname:".hbs"}))
app.set('view engine' , '.hbs')
app.set('views' , './views')

// midleware
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(express.json())

// router
app.use("/api/v1", require("./routers/user.router"))
app.use("/", require("./routers/vistas.router"))




app.listen(PORT, console.log(chalk.green.bold(`Servidor corriendo en el puerto ${PORT}`)))

// skaters-park