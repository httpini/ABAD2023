const {Router}= require("express")
const router = Router()
const {select,porTorneo, agregarTarjetas, edit,edited } = require("../controllers/fair_play.controller")
const superAdmin = require('../middlewares/superAdmin')


router.get("/",[superAdmin], select)
router.get("/torneo/:torneo_id",[superAdmin], porTorneo)
router.get("/edit/:id",[superAdmin], edit)
router.put("/edit/:id",[superAdmin], edited)
router.put("/:id/agregar",[superAdmin], agregarTarjetas)




module.exports= router