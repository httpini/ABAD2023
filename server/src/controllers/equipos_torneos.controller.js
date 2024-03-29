const {torneo, categoria, predio, equipo_torneo, equipo}= require("../database/models/index")

module.exports={
    list:async (req,res)=>{
        let equipos_torneos = await equipo_torneo.findAll({
            include:[
                {
                    model:predio,
                    as:"predio",
                    atributes:["name", "id"]
                },
                {
                    model: equipo,
                    as:"equipo",
                    atributes:["name","categoria_id"]
                },
                {
                    model:torneo,
                    as:"torneo",
                    atributes:["name","temporada"]
                }
            ],
            order:[
                ["torneo_id", "DESC"]
            ]
        })
        if(req.query && req.query.name){
            equipos_torneos = equipos_torneos.filter(e => e.equipo.name.toLowerCase().indexOf(req.query.name.toLowerCase())> -1)
        }

        if(req.query && req.query.torneo_id){
            equipos_torneos = equipos_torneos.filter(e=>e.torneo_id == req.query.torneo_id)
        }
        if(req.query && req.query.categoria_id){
            equipos_torneos = equipos_torneos.filter(e=>e.equipo.categoria_id == req.query.categoria_id)
        }
        if(req.query && req.query.predio_id){
            equipos_torneos = equipos_torneos.filter(e=> e.predio_id == req.query.predio_id)
        }
        
        let torneos = await torneo.findAll({
            order:[
                ["id", "DESC"]
            ]
        })       
        let categorias = await categoria.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
       
        let predios = await predio.findAll({
            order:[
                ["name","ASC"]
            ]
        })
        return res.render("equipos_torneos/list",{
            title: "Equipos en Torneos",
            allEquipos: equipos_torneos,
            torneos:torneos,
            categorias:categorias,
            predios:predios,
            filter:req.query
        })
    },
    oneEquipo:async (req,res)=>{},
    edit:async (req,res)=>{
        let equipos_torneos= await equipo_torneo.findByPk(req.params.id , {
            include:[
                {
                    model: equipo,
                    as:"equipo",
                    atributes:["name"]
                },
                {
                    model:torneo,
                    as:"torneo",
                    atributes:["name","temporada"]
                }
            ]
        })
        if(!equipos_torneos){
            return res.redirect("/equipos-torneos")
        }
        let predios = await predio.findAll({
            include:{all:true},
            order:[
                ["name","ASC"]
            ]
        })
        
        return res.render("equipos_torneos/edit",{
            title: "Editar Horario y Predio",
            equipo: equipos_torneos,
            predios: predios
        })


    },
    edited:async (req,res)=>{
        let equipos_torneos = await equipo_torneo.findByPk(req.params.id,{

        })
        if(!equipos_torneos){
            return res.redirect("/equipos-torneos")
        }
        if(req.body.predio_id){
            await equipos_torneos.update({
                predio_id:req.body.predio_id
            })
        }
        if(req.body.horario_local){

            req.body.horario_local += ":00"
            await equipos_torneos.update({
                horario_local:req.body.horario_local
            })
        }
        return res.redirect("/equipos-torneos")
       
    },
    destroid:async (req,res)=>{},
    allEquiposTorneos: async(req,res)=>{
        let listaEquipos = await equipo_torneo.findAll({
            include:{all:true}
            
        })
        return res.send(listaEquipos)

    }
}