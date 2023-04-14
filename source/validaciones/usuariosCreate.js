const {body, check} = require("express-validator")

const {usuario} = require('../database/models/index')

const create = [
    body("user_name").notEmpty().withMessage("El nombre de usuario no puede quedar vacío.").bail().isLength({min:2}).withMessage("El nombre de usuario debe contener al menos dos caracteres").bail().custom(async (value)=>{
        let usuarios = await usuario.findAll()
        users = usuarios.map(u => u.user_name)
        if (users.includes(value)){
            throw new Error("Este nombre de usuario ya esta registrado")
        }
        return true
    }).bail(),

    body("name").notEmpty().withMessage("El nombre no puede quedar vacío.").bail().isLength({min:2}).withMessage("El nombre debe contener al menos dos caracteres").bail(),

    body("last_name").notEmpty().withMessage("El apellido no puede quedar vacío.").bail().isLength({min:2}).withMessage("El apellido debe contener al menos dos caracteres").bail(),

    check("permiso").notEmpty().withMessage("Debes seleccionar un tipo de jerarquia").bail(),

    body("password").notEmpty().withMessage("La contraseña no puede quedar vacía").bail().isLength({min:8}).withMessage("La contraseña debe contener al menos ocho caracteres").bail(),
    body("passConfirm").custom( async (value,{req}) => {
        let {password} = req.body
        if(value !== password){
            throw new Error("Las contraseñas deben coincidir")
        }
        return true

    }).bail(),
    
]
module.exports = create