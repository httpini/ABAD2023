const {Router} = require("express")
const router = Router()
const {create, edit,created, edited, destroid, allTernas, detail}= require("../controllers/ternas.controller")
const createEdit = require("../validaciones/ternasCreateEdit")
const loggedMiddleware = require('../middlewares/logged')
const superAdmin = require('../middlewares/superAdmin')


router.get("/",[loggedMiddleware], create)
router.post("/created",[createEdit,superAdmin],created)
router.get("/edit/:id",[superAdmin], edit)
router.put("/edit/:id",[createEdit,superAdmin], edited)
router.delete("/delete/:id",[superAdmin], destroid)
router.get("/all", allTernas)
router.get("/:id",[loggedMiddleware], detail)



module.exports= router