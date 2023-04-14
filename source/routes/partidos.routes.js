const {Router}= require("express")
const router = Router()
const {select,porTorneo, edit, edited, destroid, partido} = require("../controllers/partidos.controller")
const loggedMiddleware = require('../middlewares/logged')
const superAdmin = require('../middlewares/superAdmin')

router.get("/",[superAdmin], select)
router.get("/torneo/:torneo_id",[superAdmin], porTorneo)
router.get("/torneo/:torneo_id/edit/:id",[superAdmin], edit)
router.put("/edit/:id",[loggedMiddleware], edited)
router.delete("/delete/:id",[superAdmin], destroid)

router.get("/all", partido)





module.exports= router