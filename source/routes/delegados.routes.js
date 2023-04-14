const {Router} = require("express")
const router = Router()
const {create, edit,created, edited, destroid}= require("../controllers/delegados.controller")
const createEdit = require("../validaciones/delegadosCreateEdit")
const loggedMiddleware = require('../middlewares/logged')


router.get("/",[loggedMiddleware], create)
router.post('/created', [createEdit,loggedMiddleware], created)
router.get('/edit/:id',[loggedMiddleware], edit)
router.put('/edit/:id', [createEdit,loggedMiddleware], edited)
router.delete("/delete/:id",[loggedMiddleware], destroid)



module.exports= router