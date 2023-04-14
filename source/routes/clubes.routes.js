const {Router}= require("express")
const router = Router()
const {created, edit, edited, list} = require("../controllers/clubes.controller")
const loggedMiddleware = require('../middlewares/logged')
const superAdmin = require('../middlewares/superAdmin')


router.get("/",[loggedMiddleware], list)
router.post("/created", [superAdmin],created)
router.get("/edit/:id",[superAdmin], edit)
router.put("/edit/:id",[superAdmin], edited)


module.exports= router