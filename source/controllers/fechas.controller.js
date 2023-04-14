const {fecha, torneo, partido, equipo_torneo, terna, predio, estado_partido}= require("../database/models/index")
const{actualizar,restablecer}= require("../modules/actualizarTabla")

const {validationResult} = require('express-validator')
module.exports ={
    select: async (req,res)=>{
            let torneos = await torneo.findAll({
                order:[
                    ["temporada", "DESC"],
                    ["name", "ASC"]
                ]
            })

        res.render("fechas/select",{
            title: "Selecciona un torneo",
            torneos: torneos
        })
    },
    porTorneo: async (req,res)=>{
        let fechas = await fecha.findAll({
            include:{all:true},
            where:{
                torneo_id:req.params.torneo_id
            },
            order:[
                ["nro", "ASC"]
            ]
        })
            
        let torneos = await torneo.findByPk(req.params.torneo_id)
        
        return res.render("fechas/list",{
            title:`Fechas ${torneos.name} ${torneos.temporada}`,
            fechas:fechas,
            torneo:torneos
        })
    },
    create: async(req,res)=>{
        let torneos = await torneo.findByPk(req.params.torneo_id,{
        })
        return res.render("fechas/create",{
            title:`Crear Fecha para ${torneos.name} ${torneos.temporada}`,
            torneo:torneos
        })

    },
    created:async (req,res)=>{
        let torneos = await torneo.findByPk(req.params.torneo_id,{
        })

        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            return res.render("fechas/create",{
                title:`Crear Fecha para ${torneos.name} ${torneos.temporada}`,
                torneo: torneos,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }

        let fechaCreada = await fecha.create({
            nro: req.body.nro,
            name: req.body.name,
            torneo_id: req.body.torneo_id,
            dia:req.body.dia
        })
        for (i=0; i<req.body.local_id.length; i++){
            datos_local = await equipo_torneo.findByPk(req.body.local_id[i],{
                include:{all:true}
            })
            // console.log(datos_local)


            await partido.create({
                fecha_id: fechaCreada.id,
                dia: fechaCreada.dia,
                estado_id: 2,
                hora:datos_local.horario_local,
                predio_id: datos_local.predio_id,
                local_id: req.body.local_id[i],
                visitante_id:req.body.visitante_id[i],
                terna_id:req.body.terna_id[i] == "0"? null : req.body.terna_id[i],
                torneo_id:fechaCreada.torneo_id
                
            })
        }
        return res.redirect(`/fechas/torneo/${req.params.torneo_id}`)

    },
    edit:async(req,res)=>{
        let fec = await fecha.findByPk(req.params.id,{
            include:{all:true}
        })
        if(!fec){
            return res.redirect(`/fechas/torneo/${req.params.torneo_id}`)
        }
        let partidos = await partido.findAll({
            where:{
                fecha_id:fec.id
            },
            order:[
                ["dia", "ASC"]
            ],
            include:{all:true}
        })
        let ternas = await terna.findAll({
            include:{all:true},
            order:[
                ["name","ASC"]
            ]
        })
        let predios = await predio.findAll({
            include:{all:true},
            order:[
                ["name","ASC"]
            ]
        })
        let estados = await estado_partido.findAll({
            include:{all:true},
            order:[
                ["name","ASC"]
            ]
        })
        return res.render("fechas/edit",{
            title: "Editar Campos de Fair Play",
            fecha: fec,
            partidos:partidos,
            predios:predios,
            ternas:ternas,
            estados:estados
        })
    },
    edited: async(req,res)=>{
        let fec = await fecha.findByPk(req.params.id,{
            include:{all:true}
        })
        if(!fec){
            return res.redirect(`/fechas/torneo/${req.params.torneo_id}`)
        }

        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            return res.render("fechas/edit",{
                title: "Editar Campos de Fair Play",
                fecha: fec,
                partidos:partidos,
                predios:predios,
                ternas:ternas,
                estados:estados,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }

        await fec.update(req.body)

        return res.redirect(`/fechas/torneo/${req.params.torneo_id}`)

    },
    destroid:async(req,res)=>{
        let fec = await fecha.findByPk(req.params.id,{
            include:{all:true}
        })
        if(!fec){
            return res.redirect(`/fechas/torneo/${req.params.torneo_id}`)
        }

        let partidos = await partido.findAll({
            include:{all:true},
            where:{
                fecha_id:fec.id
            }
        })

        partidos.forEach(async partido=>{
            let local = await equipo_torneo.findByPk(partido.local_id)
            let visitante = await equipo_torneo.findByPk(partido.visitante_id)

            restablecer(local,visitante,partido)
            await local.save()
            await visitante.save()
        })
      

        //SI ELIMINO UNA FECHA DEBERIA ELIMINAR LOS PUNTOS DE LA TABLA DE CADA PARTIDO

        await partido.destroy({
            where:{
                fecha_id: fec.id
            }
        })

        await fec.destroy()
        return res.redirect(`/fechas/torneo/${req.params.torneo_id}`)

    }
}   