const { equipo, torneo, equipo_torneo, fair_play, goleador, sancionado, partido } = require("../../database/models/index")
const { Op } = require('sequelize');

module.exports = {
    //ESTE allTorneos es el que vas a requerir en el home en el desplegable del header "torneos", van a estar de mas nuevos a mas viejos

    allTorneos: async (req, res) => {
        try {
            let torneos = await torneo.findAll({
                // include:{all:true},
                order: [
                    ["temporada", "DESC"],
                    ["id", "DESC"]
                ]
            })

            torneos = torneos.map(t => {
                let data = {
                    id: t.id,
                    name: `${t.name} ${t.temporada}`,
                    name_url: t.name_url
                }
                return data
            })
            return res.send({ torneos }).status(200)
        } catch (error) {
            return res.status(505).json(error)
        }
    },
    //EN oneTorneo voy a mandar los datos para mostrar cuando se selecciona un torneo, el nombre, el reglamento, la descripcion de la categoria a la que pertenece, etc
    //tambien voy a enviar los datos de las tablas, los datos de los goleadores y los datos de fair play por ahora, estaba en duda si lo enviaba en esta ruta o armaba un controlador para cada uno
    oneTorneo: async (req, res) => {
        try {
            let elTorneo = await torneo.findOne({
                include: { all: true },
                where: {
                    name_url: req.params.torneo_url
                }
            })

            let datosTorneo = {
                //COLOCAR UN NAME O ALGO PARA QUE FIGURE EN LA RUTA PARA QUE QUEDE MEJOR
                id: elTorneo.id,
                name: `${elTorneo.name} ${elTorneo.temporada}`,
                name_url: elTorneo.name_url,
                description: elTorneo.categoria.description,
                reglamento: "reglamento"
            }
            elTorneo = datosTorneo

            let tabla = await equipo_torneo.findAll({
                include: { all: true },
                where: {
                    torneo_id: elTorneo.id
                },
                order: [
                    ["pts", "DESC"],
                    ["g_dif", "DESC"],
                    ["g_favor", "DESC"],
                    ["p_ganados", "DESC"],
                ]
            })

            //TE ENVIO LOS DATOS DE LA TABLA Y LOS COLORES DE CADA UNO PARA QUE LE PONGAS ADELANTE DEL NOMBRE DEL EQUIPO EN LA VISTA.
            tabla = tabla.map((e, index) => {
                let data = {
                    //YA VA CON LA POSICION DE LA TABLA PUESTA
                    pos: index + 1,
                    equipo: e.team_name,
                    pts: e.pts,
                    p_jugados: e.p_jugados,
                    p_ganados: e.p_ganados,
                    p_empatados: e.p_empatados,
                    p_perdidos: e.p_perdidos,
                    g_favor: e.g_favor,
                    g_contra: e.g_contra,
                    g_dif: e.g_dif,
                    colores: []
                }
                if (e.color_1 != null) {
                    data.colores.push(e.color_1)
                }
                if (e.color_2 != null) {
                    data.colores.push(e.color_2)
                }
                if (e.color_3 != null) {
                    data.colores.push(e.color_3)
                }
                return data
            })



            let fp = await fair_play.findAll({
                include: { all: true },
                where: {
                    torneo_id: elTorneo.id
                },
                order: [
                    ["puntos", "ASC"],
                    ["amonestaciones", "ASC"]
                ]
            })
            fp = fp.map((f, index) => {

                let data = {
                    pos: index + 1,
                    equipo: f.equipo.name,
                    puntos: f.puntos,
                    amarillas: f.amarillas,
                    rojas: f.rojas,
                    amonestaciones: f.amonestaciones,
                    motivos_amonestaciones: f.motivos_amon
                }
                return data;

            })


            let goleadores = await goleador.findAll({
                include: { all: true },
                where: {
                    torneo_id: elTorneo.id
                },
                order: [
                    ["goles", "DESC"]
                ]
            })

            goleadores = goleadores.map((g, index) => {
                //TE PASO LOS COLORES DE LOS EQUIPOS PARA PONER COMO SI FUERA EL ESCUDO
                let data = {
                    pos: index + 1,
                    equipo: g.equipo.team_name,
                    colores_equipo: [],
                    nombre: `${g.last_name} ${g.name}`,
                    goles: g.goles

                }
                if (g.equipo.color_1 != null) {
                    data.colores_equipo.push(g.equipo.color_1)
                }
                if (g.equipo.color_2 != null) {
                    data.colores_equipo.push(g.equipo.color_2)
                }
                if (g.equipo.color_3 != null) {
                    data.colores_equipo.push(g.equipo.color_3)
                }
                return data
            })
            let sancionados = await sancionado.findAll({
                include: { all: true },
                where: {
                    torneo_id: elTorneo.id
                },
                order: [
                    ["f_sancion", "ASC"]
                ]
            })
            sancionados = sancionados.map(sanc => {
                let data = {
                    equipo: sanc.equipo.team_name,
                    nombre: `${sanc.last_name} ${sanc.name}`,
                    f_sancion: sanc.fecha.name,
                    sancion: sanc.sancion,
                    vuelta: sanc.f_vuelta,
                    aclaraciones: sanc.aclaraciones ? sanc.aclaraciones : null
                }
                return data
            })


            // console.log(sancionados);
            // DE ACA SOLO FALTARIAN LAS FECHAS Y LOS PARTIDOS.
            return res.send({
                torneo: elTorneo,
                tabla: tabla,
                fair_play: fp,
                goleadores: goleadores,
                sanciones: sancionados,
            }
            ).status(200)

        }
        catch (error) {
            return res.status(505).json(error)
        }
    },
    oneTorneo2: async (req, res) => {
        try {
            let datosElTorneo = await torneo.findOne({
                include: { all: true },
                where: {
                    name_url: req.params.torneo_url
                }
            })
            
            let elTorneo = {
                //COLOCAR UN NAME O ALGO PARA QUE FIGURE EN LA RUTA PARA QUE QUEDE MEJOR
                id: datosElTorneo.id,
                name: `${datosElTorneo.name} ${datosElTorneo.temporada}`,
                name_url: datosElTorneo.name_url,
                description: datosElTorneo.categoria.description,
                reglamento: "reglamento"
            }

            async function funcionTabla () {
                return await equipo_torneo.findAll({
                    include: { all: true },
                    where: {
                        torneo_id: elTorneo.id
                    },
                    order: [
                        ["pts", "DESC"],
                        ["g_dif", "DESC"],
                        ["g_favor", "DESC"],
                        ["p_ganados", "DESC"],
                    ]
                })
            }

            async function funcionFp () {
                return await fair_play.findAll({
                    include: { all: true },
                    where: {
                        torneo_id: elTorneo.id
                    },
                    order: [
                        ["puntos", "ASC"],
                        ["amonestaciones", "ASC"]
                    ]
                })
            }
            
            async function funcionGoleadores () {
                return await goleador.findAll({
                    include: { all: true },
                    where: {
                        torneo_id: elTorneo.id
                    },
                    order: [
                        ["goles", "DESC"]
                    ]
                })
            }

            async function funcionSancionado () {
                return await sancionado.findAll({
                    include: { all: true },
                    where: {
                        torneo_id: elTorneo.id
                    },
                    order: [
                        ["f_sancion", "ASC"]
                    ]
                })
            }
            
            console.log('hola');
            let calls = await Promise.all([funcionTabla(), funcionFp(), funcionGoleadores(), funcionSancionado()])
            console.log('calls', calls[0]);

            let tabla = calls[0]

            //TE ENVIO LOS DATOS DE LA TABLA Y LOS COLORES DE CADA UNO PARA QUE LE PONGAS ADELANTE DEL NOMBRE DEL EQUIPO EN LA VISTA.
            tabla = tabla.map((e, index) => {
                let data = {
                    //YA VA CON LA POSICION DE LA TABLA PUESTA
                    pos: index + 1,
                    equipo: e.team_name,
                    pts: e.pts,
                    p_jugados: e.p_jugados,
                    p_ganados: e.p_ganados,
                    p_empatados: e.p_empatados,
                    p_perdidos: e.p_perdidos,
                    g_favor: e.g_favor,
                    g_contra: e.g_contra,
                    g_dif: e.g_dif,
                    colores: []
                }
                if (e.color_1 != null) {
                    data.colores.push(e.color_1)
                }
                if (e.color_2 != null) {
                    data.colores.push(e.color_2)
                }
                if (e.color_3 != null) {
                    data.colores.push(e.color_3)
                }
                return data
            })



            let fp = calls[1]

            fp = fp.map((f, index) => {

                let data = {
                    pos: index + 1,
                    equipo: f.equipo.name,
                    puntos: f.puntos,
                    amarillas: f.amarillas,
                    rojas: f.rojas,
                    amonestaciones: f.amonestaciones,
                    motivos_amonestaciones: f.motivos_amon
                }
                return data;

            })


            let goleadores = calls[2]

            goleadores = goleadores.map((g, index) => {
                //TE PASO LOS COLORES DE LOS EQUIPOS PARA PONER COMO SI FUERA EL ESCUDO
                let data = {
                    pos: index + 1,
                    equipo: g.equipo.team_name,
                    colores_equipo: [],
                    nombre: `${g.last_name} ${g.name}`,
                    goles: g.goles

                }
                if (g.equipo.color_1 != null) {
                    data.colores_equipo.push(g.equipo.color_1)
                }
                if (g.equipo.color_2 != null) {
                    data.colores_equipo.push(g.equipo.color_2)
                }
                if (g.equipo.color_3 != null) {
                    data.colores_equipo.push(g.equipo.color_3)
                }
                return data
            })
            
            let sancionados = calls[3]
            sancionados = sancionados.map(sanc => {
                let data = {
                    equipo: sanc.equipo.team_name,
                    nombre: `${sanc.last_name} ${sanc.name}`,
                    f_sancion: sanc.fecha.name,
                    sancion: sanc.sancion,
                    vuelta: sanc.f_vuelta,
                    aclaraciones: sanc.aclaraciones ? sanc.aclaraciones : null
                }
                return data
            })


            console.log(sancionados);
            // DE ACA SOLO FALTARIAN LAS FECHAS Y LOS PARTIDOS.
            return res.send({
                torneo: elTorneo,
                tabla: tabla,
                fair_play: fp,
                goleadores: goleadores,
                sanciones: sancionados,
            }
            ).status(200)
        }
        catch (error) {
            return res.status(505).json(error)
        }
    },
    equipoEnTorneo: async (req, res) => {
        try {
            //VOY A DIVIDIR LA INFORMACION ENTRE DATOS DEL EQUIPO, TABLA, FAIR PLAY, GOLEADORES, SANCIONADOS Y PARTIDOS
            let elTorneo = await torneo.findOne({
                where: {
                    name_url: req.params.torneo_url
                }
            })

            let elEquipo = await equipo.findByPk(req.params.equipo_id)

            //traemos todos los equipos para mapearle la posicion en la tabla
            let pos = await equipo_torneo.findAll({
                order: [
                    ["pts", "DESC"]
                ],
                where: {
                    torneo_id: elTorneo.id
                }
            })

            pos = pos.map((p, i) => {
                let data = {
                    pos: i + 1,
                    equipo_id: p.equipo_id,
                }
                return data
            })

            pos = pos.filter(p => {
                return p.equipo_id == elEquipo.id
            })//filtramos el equipo que queremos para dejar como dato su posicion enla tabla

            let laPos = pos[0].pos

            let datosEquipo = await equipo_torneo.findOne({
                include: { all: true },
                where: {
                    torneo_id: elTorneo.id,
                    equipo_id: elEquipo.id
                }
            })

            //DATOS DEL EQUIPO
            let equipoDatos = {
                id: datosEquipo.id,
                name: datosEquipo.team_name,
                colores: [],
                predio_name: datosEquipo.predio ? datosEquipo.predio.name : null,
                predio_direccion: datosEquipo.predio ? datosEquipo.predio.adress : null,
                predio_url: datosEquipo.predio ? datosEquipo.predio.map : null,
                horario_local: datosEquipo.horario_local ? datosEquipo.horario_local : null,
            }
            if (datosEquipo.color_1 != null) {
                equipoDatos.colores.push(datosEquipo.color_1)
            }
            if (datosEquipo.color_2 != null) {
                equipoDatos.colores.push(datosEquipo.color_2)
            }
            if (datosEquipo.color_3 != null) {
                equipoDatos.colores.push(datosEquipo.color_3)
            }

            //DATOS DE LA TABLA
            let tablaDatos = {
                pos: laPos,
                pts: datosEquipo.pts,
                pj: datosEquipo.p_jugados,
                pg: datosEquipo.p_ganados,
                pe: datosEquipo.p_empatados,
                pp: datosEquipo.p_perdidos,
                gf: datosEquipo.g_favor,
                gc: datosEquipo.g_contra,
                dg: datosEquipo.g_dif
            }

            let goleadores = await goleador.findAll({
                include: { all: true },
                order: [
                    ["goles", "DESC"]
                ],
                where: {
                    torneo_id: elTorneo.id,
                    equipo_id: datosEquipo.id
                }
            })

            let goleadoresDatos = null
            //DATOS DE GOLEADORES, SI NO HAY NINGUNO DEVUELVE NULL
            if (goleadores) {
                goleadoresDatos = goleadores.map(g => {
                    let data = {
                        name: `${g.last_name} ${g.name}`,
                        goles: g.goles
                    }
                    return data
                })
            }

            let sanciones = await sancionado.findAll({
                include: { all: true },
                where: {
                    equipo_id: datosEquipo.id,
                    torneo_id: elTorneo.id
                },
                order: [
                    ["f_sancion", "DESC"]
                ]
            })

            let sancionesDatos = null
            //DATOS DE SANCIONES, SI NO HAY NINGUNO DEVUELVE NULL
            if (sanciones) {
                sancionesDatos = sanciones.map(sanc => {
                    let data = {
                        name: `${sanc.last_name} ${sanc.name}`,
                        f_sancion: sanc.fecha.name,
                        sancion: sanc.sancion,
                        f_vuelta: sanc.f_vuelta
                    }
                    return data
                })
            }


            //Ahora vamos a buscar los datos de fairplay

            let posFP = await fair_play.findAll({
                order: [
                    ["puntos", "ASC"]
                ],
                where: {
                    torneo_id: elTorneo.id
                }
            })
            posFP = posFP.map((fp, i) => {
                let data = {
                    pos: i + 1,
                    equipo_id: fp.equipo_id,
                }
                return data
            })
            posFP = pos.filter(p => {
                return p.equipo_id == elEquipo.id
            })//filtramos el equipo que queremos para dejar como dato su posicion enla tabla
            let laPosFP = posFP.pos

            let fp = await fair_play.findOne({
                include: { all: true },
                where: {
                    torneo_id: elTorneo.id,
                    equipo_id: elEquipo.id
                }
            })
            let fpDatos = {
                pos: laPosFP,
                ta: fp.amarillas,
                tr: fp.rojas,
                amonestaciones: fp.amonestaciones
            }

            //AHORA VOY A TRAER LOS DATOS DE LOS PARTIDOS

            let partidos = await partido.findAll({
                include: { all: true },
                order: [
                    ["dia", "DESC"]
                ],
                where: {
                    torneo_id: elTorneo.id,
                    estado_id: 4,
                    [Op.or]: [
                        { visitante_id: datosEquipo.id },
                        { local_id: datosEquipo.id }
                    ]
                }
            })

            let partidosDatos = partidos.map(p => {
                let data = {
                    id: p.id,
                    dia: p.dia,
                    fecha: p.fecha.name,
                    localVisitante: p.local_id == datosEquipo.id ? "L" : "V",
                    rival: p.local_id == datosEquipo.id ? p.visitante.team_name : p.local.team_name,
                    resultado: p.local_id == datosEquipo.id ? `${p.g_local} - ${p.g_visitante}` : `${p.g_visitante} - ${p.g_local}`
                }
                return data
            })

            return res.send({
                equipo: equipoDatos,
                tabla: tablaDatos,
                fair_play: fpDatos,
                goleadores: goleadoresDatos,
                sancionados: sancionesDatos,
                partidos: partidosDatos,

            }).status(200)

        } catch (error) {
            return res.status(505).json(error)
        }
    }

}