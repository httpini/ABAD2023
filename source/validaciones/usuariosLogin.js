const {body} = require("express-validator")
const {usuario} = require('../database/models/index')
const {compareSync} = require("bcryptjs")
const login = [
    body("nombreUsuario").notEmpty().withMessage("Debes colorar un nombre de usuario").bail().custom( async (value) => {
       let users = await usuario.findAll()
        let user = users.map(u => u.user_name)
        if(!user.includes(value)){
            throw new Error("El usuario no está registrado")
        } 
        return true
    }).bail(),
    body("password").notEmpty().withMessage("La contraseña no puede quedar vacía").bail().isLength({min:8}).withMessage("La contraseña debe contener al menos ocho caracteres").bail().custom( async (value, {req}) => {
        let {nombreUsuario} = req.body
        let user = await usuario.findOne({
            where:{
                user_name: nombreUsuario
            }
        })
        
        //if(!user){
         //   throw new Error("Usuario no encontrado")
        //}
        if(!compareSync(value, user.password)){
            throw new Error("La contraseña es incorrecta")
        }
        return true
    })
]

module.exports = login