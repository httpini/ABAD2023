const {Router}= require("express")
const router = Router()
const {select, create,created, edited, destroid} = require("../controllers/sancionados.controller")
const createEdit = require("../validaciones/sancionadosCreateEdit")
const superAdmin = require('../middlewares/superAdmin')

router.get("/", [superAdmin], select)
router.get("/torneo/:torneo_id", [superAdmin], create)
router.post("/torneo/:torneo_id/created", [createEdit, superAdmin], created )
router.put("/torneo/:torneo_id/edit/:id",[createEdit, superAdmin], edited)
router.delete("/delete/:id", [superAdmin], destroid)





module.exports= router