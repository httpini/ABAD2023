
const { partido, torneo, fecha, predio, equipo_torneo, estado_partido } = require("../../database/models/index")


const { Op } = require('sequelize');


module.exports = {
    confirmados: async (req, res) => {
        try {
            let partidos = await partido.findAll({

                include: [
                    {
                        model: fecha,
                        as: "fecha",
                        atributes: ["name"]
                    },
                    {
                        model: estado_partido,
                        as: "estado",
                        atributes: ["name"]
                    },
                    {
                        model: predio,
                        as: "predio",
                        atributes: ["name", "map"]
                    },
                    {
                        model: equipo_torneo,
                        as: "local",
                        atributes: ["team_name", "color_1", "color_2", "color_3"]
                    },
                    {
                        model: equipo_torneo,
                        as: "visitante",
                        atributes: ["team_name", "color_1", "color_2", "color_3"]
                    },
                    {
                        model: torneo,
                        as: "torneo",
                        atributes: ["name", "temporada", "name_url"]
                    }
                ],

                where: {
                    [Op.or]: [
                        { estado_id: 3 },
                        { estado_id: 6 }
                    ]
                },
                order: [
                    ["dia", "ASC"],
                    ["hora", "ASC"]
                ]
            });

            let count = partidos.length

            partidos = partidos.map(p => {
                let fechaOriginal = p.dia
                let elementosDia = fechaOriginal.split("-")
                let dateFormated = elementosDia[2] + "-" + elementosDia[1] + "-" + elementosDia[0]

                let data = {

                    hora: p.hora!=null && p.hora != "00:00:00"?p.hora.slice(0,-3):null,
                    dia: p.dia == "0000-00-00" || p.dia == null ? "A Confirmar" : dateFormated,
                    fecha: p.fecha.name,
                    local_name: p.local.team_name,
                    local_colores: [],
                    visitante_name: p.visitante.team_name,
                    visitante_colores: [],
                    predio_name: p.predio_id == null ? null : p.predio.name,
                    predio_url: p.predio_id == null ? null : p.predio.map,
                    estado: p.estado.name,
                    torneo_name: `${p.torneo.name} ${p.torneo.temporada}`,
                    torneo_url:p.torneo.name_url

                }
                if (p.estado_id == 5 || p.estado_id == 7) {
                    data.motivo_postergado = p.motivo_postergado
                }
                if (p.local.color_1 != null && p.local.color_1 != "") {
                    data.local_colores.push(p.local.color_1)
                }
                if (p.local.color_2 != null && p.local.color_2 != "") {
                    data.local_colores.push(p.local.color_2)
                }
                if (p.local.color_3 != null && p.local.color_3 != "") {
                    data.local_colores.push(p.local.color_3)
                }
                if (p.visitante.color_1 != null && p.visitante.color_1 != "") {
                    data.visitante_colores.push(p.visitante.color_1)
                }
                if (p.visitante.color_2 != null && p.visitante.color_2 != "") {
                    data.visitante_colores.push(p.visitante.color_2)
                }
                if (p.visitante.color_3 != null && p.visitante.color_3 != "") {
                    data.visitante_colores.push(p.visitante.color_3)
                }


                return data
            })


            return res.send({ count: count, partidos: partidos }).status(200)



        } catch (error) {
            return res.status(505).json(error)
        }
    },
    disputados: async (req, res) => {
        try {
            let partidos = await partido.findAll({

                include: [
                    {
                        model: fecha,
                        as: "fecha",
                        atributes: ["name"]
                    },
                    {
                        model: estado_partido,
                        as: "estado",
                        atributes: ["name"]
                    },
                    {
                        model: predio,
                        as: "predio",
                        atributes: ["name", "map"]
                    },
                    {
                        model: equipo_torneo,
                        as: "local",
                        atributes: ["team_name", "color_1", "color_2", "color_3"]
                    },
                    {
                        model: equipo_torneo,
                        as: "visitante",
                        atributes: ["team_name", "color_1", "color_2", "color_3"]
                    },
                    {
                        model: torneo,
                        as: "torneo",
                        atributes: ["name", "temporada", "name_url"]
                    }
                ],

                where: {
                    [Op.or]: [
                        { estado_id: 4 },
                        { estado_id: 7 },
                        { estado_id: 5 }
                    ]
                },
                order: [
                    ["dia", "DESC"],
                    ["hora", "DESC"]
                ],
                limit: 48
            })


            let count = partidos.length


            partidos = partidos.map(p => {
                let fechaOriginal = p.dia
                let elementosDia = fechaOriginal.split("-")
                let dateFormated = elementosDia[2] + "-" + elementosDia[1] + "-" + elementosDia[0]
                let data = {
                    hora: p.hora!=null && p.hora != "00:00:00"?p.hora.slice(0,-3):null,
                    dia: p.dia == "0000-00-00" || p.dia == null ? "A Confirmar" : dateFormated,
                    fecha: p.fecha.name,
                    torneo_name: `${p.torneo.name} ${p.torneo.temporada}`,
                    torneo_url: p.torneo.name_url,

                    local_name: p.local.team_name,
                    local_colores: [],
                    local_goles: p.g_local,

                    visitante_name: p.visitante.team_name,
                    visitante_colores: [],
                    visitante_goles: p.g_visitante,
                    //ACA CON EL PREDIO HAY UN TEMA, PREFERIS QUE TE PASE A CONFIRMAR O QUE DEJE NULL Y VOS LE ARMAS LA LOGICA PARA QUE DIGA A CONFIRMAR?
                    predio_name: p.predio_id == null ? null : p.predio.name,
                    predio_url: p.predio_id == null ? null : p.predio.map,
                    estado: p.estado.name
                }
                if (p.estado_id == 5 || p.estado_id == 7) {
                    data.motivo_postergado = p.motivo_postergado
                }
                if (p.local.color_1 != null && p.local.color_1 != "") {
                    data.local_colores.push(p.local.color_1)
                }
                if (p.local.color_2 != null && p.local.color_2 != "") {
                    data.local_colores.push(p.local.color_2)
                }
                if (p.local.color_3 != null && p.local.color_3 != "") {
                    data.local_colores.push(p.local.color_3)
                }
                if (p.visitante.color_1 != null && p.visitante.color_1 != "") {
                    data.visitante_colores.push(p.visitante.color_1)
                }
                if (p.visitante.color_2 != null && p.visitante.color_2 != "") {
                    data.visitante_colores.push(p.visitante.color_2)
                }
                if (p.visitante.color_3 != null && p.visitante.color_3 != "") {
                    data.visitante_colores.push(p.visitante.color_3)
                }


                return data
            })


            return res.send({ count: count, partidos: partidos }).status(200)

        } catch (error) {
            return res.status(505).json(error)
        }
    },
    porTorneo: async (req, res) => {
        try {
            let elTorneo = await torneo.findOne({

                where: {
                    name_url: req.params.torneo_id

                }
            })
            async function functionFechas() {
                let result = await fecha.findAll({
                    where: {
                        torneo_id: elTorneo.id
                    },
                    order: [
                        ["nro", "ASC"]
                    ]
                })
                let mappedResult = result.map(f => {
                    let data = {
                        numero: f.nro,
                        name: f.name
                    }
                    return data
                })
                return mappedResult
            }
            async function functionPartidos() {
                let result = await partido.findAll({
                    include: [
                        {
                            model: fecha,
                            as: "fecha",
                            atributes: ["nro"]
                        },
                        {
                            model: estado_partido,
                            as: "estado",
                            atributes: ["name"]
                        },
                        {
                            model: predio,
                            as: "predio",
                            atributes: ["name", "map"]
                        },
                        {
                            model: equipo_torneo,
                            as: "local",
                            atributes: ["team_name", "color_1", "color_2", "color_3"]
                        },
                        {
                            model: equipo_torneo,
                            as: "visitante",
                            atributes: ["team_name", "color_1", "color_2", "color_3"]
                        }
                    ],
                    where: {
                        torneo_id: elTorneo.id
                    },
                    order: [
                        ["dia", "ASC"],
                        ["hora", "ASC"]
                    ]
                })
                let mappedResult = result.map(p => {
                    let fechaOriginal = p.dia
                    let elementosDia = fechaOriginal.split("-")
                    let dateFormated = elementosDia[2] + "-" + elementosDia[1]
                    let data = {
                        estado: p.estado.name,
                        motivo_postergado: p.motivo_postergado,
                        dia: p.dia == "0000-00-00" || p.dia == null ? "A Conf.." : dateFormated,
                        hora: p.hora != null && p.hora != "" ? p.hora.slice(0, -3) : "A Conf..",
                        local_name: p.local.team_name,
                        local_colores: [],
                        g_local: p.g_local,
                        g_visitante: p.g_visitante,
                        visitante_colores: [],
                        visitante_name: p.visitante.team_name,
                        predio_name: p.predio ? p.predio.name : null,
                        predio_url: p.predio ? p.predio.map : null,
                        fecha_numero: p.fecha.nro
                    }
                    if (p.local.color_1 != null && p.local.color_1 != "") {
                        data.local_colores.push(p.local.color_1)
                    }
                    if (p.local.color_2 != null && p.local.color_2 != "") {
                        data.local_colores.push(p.local.color_2)
                    }
                    if (p.local.color_3 != null && p.local.color_3 != "") {
                        data.local_colores.push(p.local.color_3)
                    }
                    if (p.visitante.color_1 != null && p.visitante.color_1 != "") {
                        data.visitante_colores.push(p.visitante.color_1)
                    }
                    if (p.visitante.color_2 != null && p.visitante.color_2 != "") {
                        data.visitante_colores.push(p.visitante.color_2)
                    }
                    if (p.visitante.color_3 != null && p.visitante.color_3 != "") {
                        data.visitante_colores.push(p.visitante.color_3)
                    }
                    return data
                })
                return mappedResult

            }
            let calls = await Promise.all([functionFechas(), functionPartidos()])

            return res.send({ fechas: calls[0], partidos: calls[1] }).status(200)
        } catch (error) {

            return res.status(505).json(error)
        }


    }
}