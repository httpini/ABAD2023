const {body, check} = require("express-validator")

const {usuario} = require('../database/models/index')

const edit = [
    body("user_name").notEmpty().withMessage("El nombre de usuario no puede quedar vacío.").bail().isLength({min:2}).withMessage("El nombre de usuario debe contener al menos dos caracteres").bail().custom(async (value, {req})=>{
        let usuarios = await usuario.findAll()
        let {id} = req.body
        users= usuarios.filter(u=> u.id != id )
        users = users.map(u => u.user_name)
        if (users.includes(value)){
            throw new Error("Este nombre de usuario ya esta registrado")
        }
        return true
    }).bail(),

    body("name").notEmpty().withMessage("El nombre no puede quedar vacío.").bail().isLength({min:2}).withMessage("El nombre debe contener al menos dos caracteres").bail(),

    body("last_name").notEmpty().withMessage("El apellido no puede quedar vacío.").bail().isLength({min:2}).withMessage("El apellido debe contener al menos dos caracteres").bail(),

    check("permiso").notEmpty().withMessage("Debes seleccionar un tipo de jerarquia").bail(),

    body("newPassword").custom(value=>{
        if(value.length > 0 && value.length < 8 ){
            throw new Error("Para cambiarla, La contraseña debe tener al menos 8 caracteres")
        }
        return true

    }).bail(),
    body("passConfirm").custom(  (value,{req}) => {
        let {newPassword} = req.body
        if(newPassword.length > 0 && value !== password){
            throw new Error("Las contraseñas deben coincidir")
        }
        return true

    })
    
]
module.exports = edit