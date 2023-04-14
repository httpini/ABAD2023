const {resolve} = require("path")
const express = require('express')
const app = express()
const {port , callback} = require("./modules/port")
const public = require("./modules/public")
const cors = require("cors")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const recordameMiddleware = require("./middlewares/recordameMiddleware")

const method = require("method-override") //PARA HACER LOS FORMS POR PUT Y DELETE

app.listen(port, callback) //DAMOS DE ALTA EL SERVIDOR
app.use(public) // STATIC DE ESTOS ARCHIVOS

app.set ("views", resolve(__dirname, "views"));
app.set ("view engine", "ejs");  //PARA USAR EJS

app.use(express.urlencoded({extended:false}));
app.use(express.json())

app.use(method("m"))//Para usar el method-override

app.use(session({
    secret: "nodejs", 
    saveUninitialized: true,
    resave: true
}))
app.use(cookieParser())
app.use(recordameMiddleware)
app.use(require("./middlewares/user"))

app.use(cors())

app.use(require("./routes/home.routes")) // RUTAS DEL HOME

app.use("/predios",require("./routes/predios.routes")) //rutas de predios

app.use("/categorias",require("./routes/categorias.routes")) //rutas de categorias

app.use("/subcategorias",require("./routes/subcategorias.routes")) 

app.use("/clubes", require("./routes/clubes.routes"))

app.use("/equipos", require("./routes/equipos.routes"))

app.use("/delegados", require("./routes/delegados.routes"))

app.use("/torneos", require("./routes/torneos.routes"))

app.use("/equipos-torneos", require("./routes/equipos_torneos.routes"))

app.use("/goleadores", require("./routes/goleadores.routes"))

app.use("/fair-play", require("./routes/fair_play.routes"))

app.use("/sancionados", require("./routes/sancionados.routes"))

app.use("/fechas", require("./routes/fechas.routes"))

app.use("/ternas", require("./routes/ternas.routes"))

app.use("/partidos", require("./routes/partidos.routes"))

app.use("/sancionados", require("./routes/sancionados.routes"))

app.use("/usuarios", require("./routes/usuarios.routes"))

app.use("/api",require("./routes/apis.routes"))


