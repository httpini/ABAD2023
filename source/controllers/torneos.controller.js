const {torneo, categoria, subcategoria, equipo, equipo_torneo, fair_play}=require("../database/models/index")
const {unlinkSync} = require('fs')
const {join, extname} = require('path')
const {validationResult} = require('express-validator')

function nameURL(nombre, temporada) {
    // Convertir el nombre a minúsculas y reemplazar espacios por guiones bajos
    const nombreFormateado = nombre.toLowerCase().replace(/\s+/g, '_');
    
    // Concatenar el nombre formateado con la temporada
    const nombreTemporada = nombreFormateado + '_' + temporada;
    
    // Retornar el resultado
    return nombreTemporada;
  }
module.exports={
    create: async (req,res)=>{
        let torneos = await torneo.findAll({
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                },
                {
                    model:subcategoria,
                    as:"subcategoria",
                    atributes:["name"]
                },
                {
                    model:equipo,
                    as:"equipos",
                    atributes:["id"]
                }
            ],
            order:[
                ["temporada", "DESC"]
            ]
        })
        if(req.query && req.query.name){
            torneos = torneos.filter(t=> t.name.toLowerCase().indexOf(req.query.name.toLowerCase())> -1)
        }
        if(req.query && req.query.cat){
            torneos= torneos.filter(t => t.categoria_id == req.query.cat)
        }
        if(req.query && req.query.subCat){
            torneos= torneos.filter(t => t.subcategoria_id == req.query.subCat)
        }
        let lastTorneos = await torneo.findAll({
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                },
                {
                    model:subcategoria,
                    as:"subcategoria",
                    atributes:["name"]
                },
                {
                    model:equipo,
                    as:"equipos",
                    atributes:["id"]
                }
            ],
            order:[
                ["id", "DESC"]
            ],
            limit:3
        })
        
        let categorias = await categoria.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        let subcategorias = await subcategoria.findAll({
            order:[
                ["name", "ASC"]
            ]
        })

        return res.render("torneos/create",{
            title:"Torneos",
            lastTorneos:lastTorneos,
            torneos:torneos,
            categorias:categorias,
            subcategorias:subcategorias
        })
    },
    created: async(req,res)=>{
        let torneos = await torneo.findAll({
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                },
                {
                    model:subcategoria,
                    as:"subcategoria",
                    atributes:["name"]
                },
                {
                    model:equipo,
                    as:"equipos",
                    atributes:["id"]
                }
            ],
            order:[
                ["temporada", "DESC"]
            ]
        })
        let lastTorneos = await torneo.findAll({
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                },
                {
                    model:subcategoria,
                    as:"subcategoria",
                    atributes:["name"]
                },
                {
                    model:equipo,
                    as:"equipos",
                    atributes:["id"]
                }
            ],
            order:[
                ["id", "DESC"]
            ],
            limit:3
        })
        
        let categorias = await categoria.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        let subcategorias = await subcategoria.findAll({
            order:[
                ["name", "ASC"]
            ]
        })
        
        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            if(req.files && req.files.length > 0){
                if(extname(req.files[0].filename) == ".pdf"){
                    unlinkSync(join(__dirname, "../../public/assets/", "reglamentos-torneos",req.files[0].filename))
                }
            }
            return res.render("torneos/create",{
                title:"Torneos",
                lastTorneos:lastTorneos,
                torneos:torneos,
                categorias:categorias,
                subcategorias:subcategorias,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }

        let nuevoTorneo = await torneo.create({
            name:req.body.name,
            temporada:req.body.temporada,
            categoria_id:req.body.categoria_id,
            subcategoria_id:req.body.subcategoria_id?req.body.subcategoria_id:null,
            name_url:nameURL(req.body.name,req.body.temporada),
        })

        if(req.files.length>0){
           await nuevoTorneo.update({
            reglamento_path: req.files[0].filename

           })
        }

        let idsEquipos = req.body.equiposTorneo

        if(idsEquipos){// ESTE IF ES EN EL CASO QUE QUERAMOS CREAR EL TORNEO SIN NINGUN EQUIPO
            if (!Array.isArray(idsEquipos)) {
                idsEquipos = [idsEquipos];
              }
    
    
            idsEquipos.forEach( async e=>{

                let equipon = await equipo.findOne({
                    where:{
                        id:e
                    }
                }); //
                

                await equipo_torneo.create({
                    torneo_id: nuevoTorneo.id,
                    equipo_id: e,
                    club_id:equipon.club_id,
                    team_name:equipon.name,
                    color_1:equipon.color_1,
                    color_2:equipon.color_2,
                    color_3:equipon.color_3,
                    p_jugados:0,
                    p_ganados:0,
                    p_empatados:0,
                    p_perdidos:0,
                    g_favor:0,
                    g_contra:0,
                    g_dif:0,
                    pts:0
                })
                await fair_play.create({
                    torneo_id: nuevoTorneo.id,
                    equipo_id: e,
                    amarillas: 0,
                    rojas:0,
                    amonestaciones: 0,
                    motivos_amon:"",
                    puntos:0
                })
            })

        }

        
        return res.redirect("/torneos")
    },
    oneTorneo: async(req,res)=>{
        let oneTorneo = await torneo.findByPk(req.params.id,{
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                },
                {
                    model:subcategoria,
                    as:"subcategoria",
                    atributes:["name"]
                },
                {
                    model:equipo,
                    as:"equipos",
                    atributes:["id"]
                }
            ]
        })
        // en equiposPosibles vamos a buscar los equipos que pertenezcan a la categoria del torneo pero que no esten en el torneo, a fin de que el usuario los pueda agregar si asi lo desease.
        let equiposPosibles = await equipo.findAll({
            
            where: {
                categoria_id: oneTorneo.categoria_id
            }
        })
        
    
        let equiposDelTorneo = oneTorneo.equipos

        if (!Array.isArray(equiposDelTorneo)) {
            equiposDelTorneo = [equiposDelTorneo];
          }

        equiposDelTorneo.forEach(e => {
            let nuevosEquiposPosibles = equiposPosibles.filter(ep => {
              return ep.id !== e.id;
            });
            equiposPosibles = nuevosEquiposPosibles;
          });
                return res.render("torneos/detail",{
            title: oneTorneo.name,
            torneo: oneTorneo,
            equipos:equiposPosibles
        })

    },
    quitarEquipos: async(req, res) => {
        let equipos = req.body.equipos;

        if(equipos){
            if (!Array.isArray(equipos)) {
                equipos = [equipos];
              }
            
              for (const equipoId of equipos) {
                await equipo_torneo.destroy({
                  where: {
                    equipo_id: equipoId,
                    torneo_id: req.params.id
                  }
                });
                await fair_play.destroy({
                    where: {
                      equipo_id: equipoId,
                      torneo_id: req.params.id
                    }
                  })
              }

        }
      
        
      
        return res.redirect(`/torneos/${req.params.id}`);
    },
    agregarEquipos: async(req,res)=>{
        let equipos = req.body.equipos

        if (equipos){
            if (!Array.isArray(equipos)) {
                equipos = [equipos];
            }
            equipos.forEach( async e=>{
                let tim = await equipo.findByPk(e)
                await equipo_torneo.create({
                    torneo_id: req.params.id,
                    equipo_id: e,
                    club_id:tim.club_id,
                    team_name:tim.name,
                    color_1:tim.color_1,
                    color_2:tim.color_2,
                    color_3:tim.color_3,
                    p_jugados:0,
                    p_ganados:0,
                    p_empatados:0,
                    p_perdidos:0,
                    g_favor:0,
                    g_contra:0,
                    g_dif:0,
                    pts:0
                })
                await fair_play.create({
                    torneo_id: req.params.id,
                    equipo_id: e
                })
            })

        }
        return res.redirect(`/torneos/${req.params.id}`)
    },
    destroid: async(req, res)=>{
        let torneos = await torneo.findByPk(req.params.id)
        if(!torneos){
            return res.redirect("/torneos")
        }
        
        await fair_play.destroy({
            where: {torneo_id: req.params.id}
        })
        if(torneos.reglamento_path){
            unlinkSync(join(__dirname, "../../public/assets/", "reglamentos-torneos",torneos.reglamento_path))
        }
        
        
        await equipo_torneo.destroy({
            where: {torneo_id: req.params.id}
        })

        await torneos.destroy()

        return res.redirect("/torneos")
    },
    edit:async(req, res)=>{
        let torneos = await torneo.findByPk(req.params.id,{
            include:[
                {
                    model:categoria,
                    as:"categoria",
                    atributes:["name"]
                },
                {
                    model:subcategoria,
                    as:"subcategoria",
                    atributes:["name"]
                },
                {
                    model:equipo,
                    as:"equipos",
                    atributes:["id", "name"]
                }
            ]
        })
        if(!torneos){
            res.redirect("/torneos")
        }
        let subcategorias = await subcategoria.findAll({
            where:{
                categoria_id: torneos.categoria_id
            },
            order:[
                ["name", "ASC"]
            ]
        })
        
        return res.render("torneos/edit",{
            title: `Editar ${torneos.name}`,
            torneo:torneos,
            subcategorias:subcategorias
        })

    },
    edited:async(req, res)=>{
        let torneos = await torneo.findByPk(req.params.id,{
        })
        if(!torneos){
            return res.redirect("/torneos")
        }//FALTA LA PARTE DEL REGLAMENTO CON MULTER.

        let subcategorias = await subcategoria.findAll({
            where:{
                categoria_id: torneos.categoria_id
            },
            order:[
                ["name", "ASC"]
            ]
        })
        let validaciones = validationResult(req)
        let {errors} = validaciones
        if(errors && errors.length > 0){
            if(req.files && req.files.length > 0){
                if(extname(req.files[0].filename) == ".pdf"){
                    unlinkSync(join(__dirname, "../../public/assets/", "reglamentos-torneos",req.files[0].filename))
                }
            }
            return res.render("torneos/edit",{
                title: `Editar Torneo ${torneos.name}`,
                torneo:torneos,
                subcategorias:subcategorias,
                oldData: req.body,
                errors:validaciones.mapped()
          })
        }
        await torneos.update({
            name:req.body.name,
            temporada:req.body.temporada,
            categoria_id:req.body.categoria_id,
            subcategoria_id:req.body.subcategoria_id?req.body.subcategoria_id:null,
            name_url:nameURL(req.body.name,req.body.temporada)
        })
        if(req.files.length > 0 && torneos.reglamento_path){
            unlinkSync(join(__dirname, "../../public/assets/", "reglamentos-torneos",torneos.reglamento_path))
        }
        if(req.files.length > 0 ){
            
            await torneos.update({
             reglamento_path: req.files[0].filename
 
            })
         }
        return res.redirect("/torneos")

    }

}