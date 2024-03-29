const {categoria, equipo, equipo_torneo, club}= require("../database/models/index")
const {validationResult} = require('express-validator')

module.exports = {
    create: async (req,res) =>{
       
        let listaEquipos = await equipo.findAll({
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                }
            ],
            order:[
                ["name", "ASC"]
            ]
        })
        if(req.query && req.query.name){
            listaEquipos = listaEquipos.filter(equipo=> equipo.name.toLowerCase().indexOf(req.query.name.toLowerCase())> -1)
        }
        if(req.query && req.query.cat){
            listaEquipos= listaEquipos.filter(equipo => equipo.categoria_id == req.query.cat)
        }
        
        let recentsEquipos = await equipo.findAll({
            include: [
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                }
            ],
            order:[
                ["id", "DESC"]
            ],
            limit:3
        })
        let listaCategorias = await categoria.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        let listaClubes = await club.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        

        return res.render ("equipos/create",{
            title: "Equipos Asociados",
            listaEquipos: listaEquipos,
            recentsEquipos: recentsEquipos,
            categorias: listaCategorias,
            count:listaEquipos.length,
            clubes:listaClubes
        })
    },
    created:async(req,res)=> {

        let listaEquipos = await equipo.findAll({
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                }
            ],
            order:[
                ["name", "ASC"]
            ]
        })
        if(req.query && req.query.name){
            listaEquipos = listaEquipos.filter(equipo=> equipo.name.toLowerCase().indexOf(req.query.name.toLowerCase())> -1)
        }
        if(req.query && req.query.cat){
            listaEquipos= listaEquipos.filter(equipo => equipo.categoria_id == req.query.cat)
        }
        
        let recentsEquipos = await equipo.findAll({
            include: [
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                }
            ],
            order:[
                ["id", "DESC"]
            ],
            limit:3
        })
        let listaCategorias = await categoria.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        let listaClubes = await club.findAll({
            order:[
                ["name", "ASC"]
            ]
        })

        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            return res.render ("equipos/create",{
                title: "Equipos Asociados",
                listaEquipos: listaEquipos,
                recentsEquipos: recentsEquipos,
                categorias: listaCategorias,
                count:listaEquipos.length,
                clubes:listaClubes,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }
        req.body.name_url = "-"
        await equipo.create(req.body)
        let ultimoEquipo = await equipo.findAll({
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                }
            ],
            order:[
                ["id", "DESC"]
            ],
            limit:1
        })
        console.log(ultimoEquipo[0]);
        await ultimoEquipo[0].update({
            name_url:`${ultimoEquipo[0].name.toLowerCase().replace(/\s+/g, '_')}_${ultimoEquipo[0].categoria.name.toLowerCase().charAt(0)}`
        })

        return res.redirect("/equipos/")

    },
    edit:async(req,res)=> {
        let categorias = await categoria.findAll()
        let equipos = await equipo.findByPk(req.params.id)
        if (!equipos){
            res.redirect("/equipos/")
        }
        let listaClubes = await club.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        return res.render("equipos/edit",{
            title: `Editar equipo ${equipos.name}`,
            equipo: equipos,
            categorias: categorias,
            clubes:listaClubes
        })
    
    },
    
    edited: async (req,res)=>{
        let equipos = await equipo.findByPk(req.params.id)
        let categorias = await categoria.findAll()
        let listaClubes = await club.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            return res.render("equipos/edit",{
                title:`Editar equipo ${equipos.name}`,
                equipo: equipos,
                categorias: categorias,
                clubes:listaClubes,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }
        await equipos.update({
            name: req.body.name,
            club_id: req.body.club_id,
            categoria_id: req.body.categoria_id,
            color_1: req.body.color_1 != ""? req.body.color_1:null,
            color_2: req.body.color_2 != ""? req.body.color_2:null,
            color_3: req.body.color_3 != ""? req.body.color_3:null,
        })

        let equiposTorneos= await equipo_torneo.findAll({
            where:{
                equipo_id:equipos.id
            }
        })
        if(equiposTorneos.length > 0){
            equiposTorneos.forEach(async et=>{
                await et.update({
                    club_id:equipos.club_id,
                    team_name:equipos.name,
                    color_1:equipos.color_1,
                    color_2:equipos.color_2,
                    color_3:equipos.color_3
                })
            })

        }
        
        return res.redirect(`/equipos/edit/${equipos.id}`)
    },
    destroid: async(req,res)=>{
        let equipos = await equipo.findByPk(req.params.id, {include:{all:true}})
        if(!equipos){
            res.redirect("/equipos/")
        }

        await equipo_torneo.destroy({
            where:{
                equipo_id:req.params.id
            }
        })
        await equipos.destroy()

         

        return res.redirect("/equipos/")
    },
    allEquipos: async (req,res)=>{
        let listaEquipos = await equipo.findAll({
            
            order:[
                ["name", "ASC"]
            ]
        })
        return res.send(listaEquipos)
    }

}