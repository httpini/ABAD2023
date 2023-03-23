const {equipo, club}=require("../../database/models/index")

module.exports={
    allClubes:async(req,res)=>{
        try{

            let clubes = await club.findAll({
                include:{all:true},
                order:[
                    ["name","ASC"]
                ]
            })
            clubes = clubes.map(c=>{
                let data={
                    id:c.id,
                    name: c.name,
                    name_url:c.name_url
                }
                return data
            })
            return res.send({clubes}).status(200)
        }catch(error){
            return res.status(505).json(error)
        }
    },
    oneClub:async(req,res)=>{
        try{
            let elClub = await club.findOne({
                where:{
                    name_url:req.params.name_url
                }
            })
            oneClub = {
                id:elClub.id,
                name: elClub.name,
                name_url:elClub.name_url,
            }
            
            let equipos = await equipo.findAll({
                include:{all:true},
                where:{
                    club_id:oneClub.id
                },
                order:[
                    ["categoria_id", "ASC"],
                    ["name", "ASC"]
                ]
            })
            equipos = equipos.map(e=>{
               
                let data={
                    id:e.id,
                    name: e.name,
                    name_url:`${e.name.toLowerCase().replace(/\s+/g, '_')}_${e.categoria.name.toLowerCase().charAt(0)}`,
                    categoria:e.categoria.name,
                    torneos:e.torneos.map(t=>{
                        let dataT={
                            id:t.id,
                            name: `${t.name} ${t.temporada}`,
                            name_url:t.name_url,
                        }
                        return dataT
                    }),
                    colores:[]
                }
                if(e.color_1 != null){
                    data.colores.push(e.color_1)
                }
                if(e.color_2 != null){
                    data.colores.push(e.color_2)
                }
                if(e.color_3 != null){
                    data.colores.push(e.color_3)
                }
                return data
            })
            return res.send({club:oneClub, equipos:equipos}).status(200)
        }catch(error){
            return res.status(505).json(error)
        }
    }
}