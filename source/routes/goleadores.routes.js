const {Router} = require("express")
const router = Router()
const {select, create, created,agregarGoles, edit, edited, destroid}= require("../controllers/goleadores.controller")
const createEdit = require("../validaciones/goleadoresCreateEdit")
const superAdmin = require('../middlewares/superAdmin')

router.get("/",[superAdmin], select)
router.get("/torneo/:torneo_id",[superAdmin], create)
router.post("/torneo/:torneo_id/created",[createEdit, superAdmin], created)
router.post("/torneo/:torneo_id/:id/agregar",[superAdmin], agregarGoles)
router.get("/torneo/:torneo_id/edit/:id",[superAdmin], edit)
router.put("/torneo/:torneo_id/edit/:id",[createEdit,superAdmin],  edited)
router.delete("/delete/:id",[superAdmin], destroid)




module.exports= router