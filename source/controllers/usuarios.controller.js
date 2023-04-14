const {usuario}= require("../database/models/index")
const {hashSync}= require("bcryptjs")
const {validationResult} = require('express-validator')

module.exports = {
    create:async(req,res)=> {
        let usuarios = await usuario.findAll({
            order:[
                ["permiso", "ASC"]
            ]
        })        

        return res.render("usuarios/create",{
            title:"Usuarios",
            usuarios: usuarios
        })
    },
    created: async(req,res)=>{
        let usuarios = await usuario.findAll({
            order:[
                ["permiso", "ASC"]
            ]
        })
        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            return res.render("usuarios/create",{
                title:"Usuarios",
                usuarios: usuarios,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }
        req.body.password= hashSync(req.body.password, 10)

        await usuario.create(req.body)

        return res.redirect("/usuarios")
    },
    edit:async(req, res)=>{
        let unUsuario = await usuario.findByPk(req.params.id)

        if(!unUsuario){
            return res.redirect("/usuarios")
        }
        return res.render("usuarios/edit",{
            title: `Editar Usuario ${unUsuario.user_name}`,
            usuario:unUsuario
        })
    },
    edited: async(req, res)=>{
        let unUsuario = await usuario.findByPk(req.params.id)

        if(!unUsuario){
            return res.redirect("/usuarios")
        }
        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            return res.render("usuarios/edit",{
                title: `Editar Usuario ${unUsuario.user_name}`,
                usuario:unUsuario,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }
        if(req.body.newPassword != "" && req.body.newPassword != null && req.body.newPassword != undefined){
            req.body.password = hashSync(req.body.newPassword, 10)
        }

        await unUsuario.update(req.body)
        return res.redirect("/usuarios")
    },
    destroid:async(req, res) => {
        let unUsuario = await usuario.findByPk(req.params.id)

        if(!unUsuario){
            return res.redirect("/usuarios")
        }
        await unUsuario.destroy()
        return res.redirect("/usuarios")
    },
    login: async (req,res) =>{
        return res.render("usuarios/login",{
            title: "Inicia Sesión"
        })
    },
    logged: async(req,res)=>{
        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            return res.render("usuarios/login",{
                title: `Inicia Sesión`,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }
        let elUsuario = await usuario.findOne({
            where: {
                user_name:req.body.nombreUsuario
            }
        })
        
        //ESTO ES DE LA SESION, NO HAY CAMBIOS
        req.session.user = elUsuario
        //LO DE ACA ABAJO SON LAS COOKIES, SIGUE SIN CAMBIOS
        if(req.body.recordame != undefined){
            res.cookie("recordame", elUsuario.user_name, {maxAge:172800000})
        }
        return res.redirect('/')
    },
    logout: async (req,res) => {
        if(req.cookies.recordame != undefined){
            res.cookie("recordame", {maxAge:0})
        }
        delete req.session.user 
        return res.redirect('/')
    }
}