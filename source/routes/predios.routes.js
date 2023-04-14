const {Router} = require("express")
const router = Router()
const {create, created, edit, edited, destroid}= require("../controllers/predios.controller")
const createEdit = require("../validaciones/prediosCreateEdit")
const loggedMiddleware = require('../middlewares/logged')
const superAdmin = require('../middlewares/superAdmin')


router.get("/",[loggedMiddleware], create)
router.post("/created",[createEdit, superAdmin],created)
router.get("/edit/:id",[superAdmin], edit)
router.put("/edit/:id",[createEdit, superAdmin], edited)
router.delete("/delete/:id",[superAdmin], destroid)


module.exports= router