const {Router} = require("express")
const router = Router()
const {created,edit, destroid, edited, allSubCategorias}= require("../controllers/subcategorias.controller")
const create = require("../validaciones/subcategoriasCreate")
const loggedMiddleware = require('../middlewares/logged')
const superAdmin = require('../middlewares/superAdmin')

router.post("/created",[create,superAdmin], created)
router.get("/edit/:id",[superAdmin], edit)
router.put("/edit/:id",[superAdmin], edited)
router.delete("/delete/:id",[superAdmin], destroid)

router.get("/all", allSubCategorias)

module.exports= router