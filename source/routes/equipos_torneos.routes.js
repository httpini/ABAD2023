const {Router} = require("express")
const router = Router()
const {list,oneEquipo, edit, edited, destroid,allEquiposTorneos}= require("../controllers/equipos_torneos.controller")
const superAdmin = require('../middlewares/superAdmin')

router.get("/",[superAdmin], list)

router.get('/edit/:id',[superAdmin], edit)
router.put('/edit/:id',[superAdmin], edited)
router.delete("/delete/:id",[superAdmin], destroid)
router.get("/all",[superAdmin], allEquiposTorneos)
router.get("/:id",[superAdmin], oneEquipo)



module.exports= router