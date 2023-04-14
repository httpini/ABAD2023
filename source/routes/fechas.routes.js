const {Router}= require("express")
const router = Router()
const {select,porTorneo,  edit,edited, create,created,destroid } = require("../controllers/fechas.controller")
const createEdit = require("../validaciones/fechasCreateEdit")
const loggedMiddleware = require('../middlewares/logged')
const superAdmin = require('../middlewares/superAdmin')

router.get("/",[loggedMiddleware], select)

router.get("/torneo/:torneo_id",[loggedMiddleware], porTorneo)

router.get("/torneo/:torneo_id/create",[superAdmin], create)
router.post("/torneo/:torneo_id/create",[createEdit, superAdmin], created)

router.get("/torneo/:torneo_id/edit/:id",[loggedMiddleware], edit)

router.put("/torneo/:torneo_id/edit/:id",[superAdmin], edited)
router.delete("/torneo/:torneo_id/delete/:id",[superAdmin], destroid)





module.exports= router