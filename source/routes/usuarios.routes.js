const {Router} = require('express')
const router = Router()
const {create,created,edit,edited,destroid, login, logged, logout} = require('../controllers/usuarios.controller')
const createUsuarios = require("../validaciones/usuariosCreate")
const editUsuarios = require("../validaciones/usuariosEdit")
const loggedMiddleware = require('../middlewares/logged')
const revLog = require('../middlewares/reverseLogged')
const superAdmin = require('../middlewares/superAdmin')


router.get("/",[superAdmin], create)
router.post("/created",[createUsuarios, superAdmin], created),
router.get("/edit/:id",[loggedMiddleware], edit)
router.put("/edit/:id",[editUsuarios, loggedMiddleware], edited)
router.delete("/delete/:id",[superAdmin], destroid)
router.get('/login',[revLog], login) //login
router.post("/login",[revLog], logged)   //logged
router.get("/logout",[loggedMiddleware], logout)


module.exports = router