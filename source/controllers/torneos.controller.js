const {torneo, categoria, subcategoria, equipo, equipo_torneo}=require("../database/models/index")

module.exports={
    create: async (req,res)=>{
        let torneos = await torneo.findAll({
            include:{all:true},
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
            include:{all:true},
            order:[
                ["id", "DESC"]
            ],
            limit:3
        })
        let equipos = await equipo.findAll({
            include:{all:true},
            order:[
                ["name", "ASC"]
            ]
        })
        let categorias = await categoria.findAll({
            include:{all:true},
            order:[
                ["name", "ASC"]
            ]
        })
        let subcategorias = await subcategoria.findAll({
            include:{all:true},
            order:[
                ["name", "ASC"]
            ]
        })

        return res.render("torneos/create",{
            title:"Torneos",
            lastTorneos:lastTorneos,
            torneos:torneos,
            equipos:equipos,
            categorias:categorias,
            subcategorias:subcategorias
        })
    },
    created: async(req,res)=>{
        console.log(req.body)

        let nuevoTorneo = await torneo.create(req.body)

        let idsEquipos = req.body.equiposTorneo

        if (!Array.isArray(idsEquipos)) {
            idsEquipos = [idsEquipos];
          }


        idsEquipos.forEach( async e=>{
            await equipo_torneo.create({
                torneo_id: nuevoTorneo.id,
                equipo_id: e
            })
        })
        return res.redirect("/torneos")
    },
    oneTorneo: async(req,res)=>{
        let oneTorneo = await torneo.findByPk(req.params.id,{
            include:{all:true}
        })
        // en equiposPosibles vamos a buscar los equipos que pertenezcan a la categoria del torneo pero que no esten en el torneo, a fin de que el usuario los pueda agregar si asi lo desease.
        let equiposPosibles = await equipo.findAll({
            include: {all:true},
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
        }
      
        return res.redirect(`/torneos/${req.params.id}`);
      },
      agregarEquipos: async(req,res)=>{
        let equipos = req.body.equipos

        if (!Array.isArray(equipos)) {
            equipos = [equipos];
        }
        equipos.forEach( async e=>{
            await equipo_torneo.create({
                torneo_id: req.params.id,
                equipo_id: e
            })
        })
        return res.redirect(`/torneos/${req.params.id}`)
      }
}