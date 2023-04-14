const {Router} = require("express")
const router = Router()
const {home}= require("../controllers/home.controller")
const loggedMiddleware = require('../middlewares/logged')


router.get('/',[loggedMiddleware], home)

module.exports= router