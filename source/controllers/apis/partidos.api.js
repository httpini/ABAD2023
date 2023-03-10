const {partido, torneo, fecha}=require("../../database/models/index")
const { Op } = require('sequelize');


module.exports={
    confirmados: async(req, res)=>{
        try{
            let partidos = await partido.findAll({
                include: {all:true},
                where: {
                    [Op.or]: [
                        { estado_id: 3 },
                        { estado_id: 6 }
                    ]
                },
                order:[
                    ["dia","ASC"],
                    ["hora","ASC"]
                ]
            });

            let count = partidos.length           
            
            partidos = partidos.map( p =>{
                
                let data = {
                    id:p.id,
                    hora:p.hora,
                    dia:p.dia,
                    fecha:p.fecha.name, 
                    torneo_id:p.fecha.torneo_id,
                    torneo_name:"",               
                    local_name:p.local.team_name,
                    local_colores:[],
                    visitante_id:p.visitante_id,
                    visitante_name: p.visitante.team_name,
                    visitante_colores:[],
                    //ACA CON EL PREDIO HAY UN TEMA, PREFERIS QUE TE PASE A CONFIRMAR O QUE DEJE NULL Y VOS LE ARMAS LA LOGICA PARA QUE DIGA A CONFIRMAR?
                    predio_name:p.predio_id ==null? null: p.predio.name,
                    predio_url:p.predio_id ==null? null : p.predio.map,
                    estado:p.estado.name                
                }
                if(p.estado_id == 5 || p.estado_id == 7){
                    data.motivo_postergado = p.motivo_postergado
                }
                if(p.local.color_1 != null){
                    data.local_colores.push(p.local.color_1)
                }
                if(p.local.color_2 != null){
                    data.local_colores.push(p.local.color_2)
                }
                if(p.local.color_3 != null){
                    data.local_colores.push(p.local.color_3)
                }
                if(p.visitante.color_1 != null){
                    data.visitante_colores.push(p.visitante.color_1)
                }
                if(p.visitante.color_2 != null){
                    data.visitante_colores.push(p.visitante.color_2)
                }
                if(p.visitante.color_3 != null){
                    data.visitante_colores.push(p.visitante.color_3)
                }


                return data
            })

            for (const p of partidos) {
                const torneo_datos = await torneo.findOne({ where: { id: p.torneo_id } })
                p.torneo_name = `${torneo_datos.name} ${torneo_datos.temporada}`
              }
            

            return res.send({count: count, partidos: partidos}).status(200)

        } catch(error){
            return res.status(505).json(error)
        }
    },
    disputados: async(req,res)=>{
        try{
            let partidos = await partido.findAll({
                include: {all:true},
                where: {
                    estado_id: 4                        
                },
                order:[
                    ["dia","DESC"],
                    ["hora","DESC"]
                ],
                limit: 48
            })

            
            let count = partidos.length
            
            
            partidos = partidos.map(p=>{
                let data = {
                    id:p.id,
                    hora:p.hora,
                    dia:p.dia,
                    fecha:p.fecha.name,
                    torneo_id:p.fecha.torneo_id,
                    torneo_name:"",  
                    local_name:p.local.team_name,
                    local_colores:[],
                    local_goles:p.g_local,
                    visitante_id:p.visitante_id,
                    visitante_name: p.visitante.team_name,
                    visitante_colores:[],
                    visitante_goles:p.g_visitante,
                    //ACA CON EL PREDIO HAY UN TEMA, PREFERIS QUE TE PASE A CONFIRMAR O QUE DEJE NULL Y VOS LE ARMAS LA LOGICA PARA QUE DIGA A CONFIRMAR?
                    predio_name:p.predio_id ==null? null: p.predio.name,
                    predio_url:p.predio_id ==null? null : p.predio.map,
                    estado:p.estado.name                
                }
                if(p.estado_id == 5 || p.estado_id == 7){
                    data.motivo_postergado = p.motivo_postergado
                }
                if(p.local.color_1 != null){
                    data.local_colores.push(p.local.color_1)
                }
                if(p.local.color_2 != null){
                    data.local_colores.push(p.local.color_2)
                }
                if(p.local.color_3 != null){
                    data.local_colores.push(p.local.color_3)
                }
                if(p.visitante.color_1 != null){
                    data.visitante_colores.push(p.visitante.color_1)
                }
                if(p.visitante.color_2 != null){
                    data.visitante_colores.push(p.visitante.color_2)
                }
                if(p.visitante.color_3 != null){
                    data.visitante_colores.push(p.visitante.color_3)
                }


                return data
            })
            for (const p of partidos) {
                const torneo_datos = await torneo.findOne({ where: { id: p.torneo_id } })
                p.torneo_name = `${torneo_datos.name} ${torneo_datos.temporada}`
              }

            return res.send({count: count, partidos: partidos}).status(200)

        } catch(error){
            return res.status(505).json(error)
        }
    },
    porTorneo: async(req,res)=>{
        try{
            let fechas = await fecha.findAll({
                include:{all:true},
                where:{
                    torneo_id:req.params.torneo_id
                },
                order:[
                    ["nro", "ASC"]
                ]
            })
            let fechas_ids=[]
            fechas.forEach(f=>{
                fechas_ids.push({fecha_id:f.id})
            })
            fechas = fechas.map(f=>{
                let data = {
                    id: f.id,
                    nro: f.nro,
                    name: f.name
                }
                return data
            })

            let partidos = await partido.findAll({
                include:{all:true},
                where:{
                    [Op.or]:fechas_ids
                },
                order:[
                    ["dia","ASC"],
                    ["hora", "ASC"]
                ]
            })

            partidos = partidos.map(p=>{
                let data = {
                    fecha_id: p.fecha_id,
                    estado:p.estado.name,
                    motivo_postergado:p.motivo_postergado,
                    dia:p.dia,
                    hora:p.hora,
                    local_name:p.local.team_name,
                    local_colores:[],
                    g_local:p.g_local,
                    g_visitante:p.g_visitante,
                    visitante_colores:[],
                    visitante_name:p.visitante.team_name,
                    predio_name:p.predio?p.predio.name:null,
                    predio_url:p.predio?p.predio.map:null
                    
                }
                if(p.local.color_1 != null){
                    data.local_colores.push(p.local.color_1)
                }
                if(p.local.color_2 != null){
                    data.local_colores.push(p.local.color_2)
                }
                if(p.local.color_3 != null){
                    data.local_colores.push(p.local.color_3)
                }
                if(p.visitante.color_1 != null){
                    data.visitante_colores.push(p.visitante.color_1)
                }
                if(p.visitante.color_2 != null){
                    data.visitante_colores.push(p.visitante.color_2)
                }
                if(p.visitante.color_3 != null){
                    data.visitante_colores.push(p.visitante.color_3)
                }
                return data
            })


            return res.send({fechas:fechas, partidos: partidos}).status(200)
        }catch(error){
            return res.status(505).json(error)
        }
        

    }
}