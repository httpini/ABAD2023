const {Router} = require('express')
const router = Router()
const {create,created,edit,edited,destroid, oneTorneo, quitarEquipos, agregarEquipos} = require('../controllers/torneos.controller')
const createMiddleware = require("../middlewares/torneosCreate")
const  editMiddleware= require("../middlewares/torneosEdit")
const superAdmin = require('../middlewares/superAdmin')

router.get("/", [superAdmin], create)
router.post("/created",[createMiddleware, superAdmin], created)
router.get("/edit/:id", [superAdmin],edit)
router.put("/edit/:id",[editMiddleware, superAdmin],edited)
router.delete("/delete/:id", [superAdmin],destroid)
router.get("/:id", [superAdmin],oneTorneo)
router.put("/:id/quitarEquipos", [superAdmin],quitarEquipos)
router.put("/:id/agregarEquipo", [superAdmin], agregarEquipos)

module.exports = router