import React, { useState, useEffect } from 'react'
// import { equipos } from '../../utils/constants'
import Link from 'next/link'
const activeTopicStyle = 'font-bold underline hover:underline text-center'
const notActive = 'hover:underline'

export default function Fechas({ partidos }) {
    const [fecha, setFecha] = useState(1)
    const [cantPartidos, setCantPartidos] = useState(5)
    const [partidosFecha, setPartidosFecha] = useState([])

    let cambioFecha = (i) => {
        return setFecha(i.target.innerHTML)
    }

    useEffect(() => {
        if (partidos.length) {
            let parts = partidos.filter(p => p.fecha_numero == fecha);
            return setPartidosFecha(parts);
        }
    }, [partidos, fecha])

    useEffect(() => {
        let fechasPartidos = []
        partidos.map(p => { if (!fechasPartidos.includes(p.fecha_numero)) fechasPartidos.push(p.fecha_numero) })
        return setCantPartidos(fechasPartidos.length)
    }, [partidos])

    return (
        <div className='tarjeta shadow-md shadow-oscuro3 bg-oscuro3'>
            <div className={`cursor-pointer flex flex-wrap justify-between items-center gap-1 border-b-2`}>
                <h1 className='text-center font-bold text-xl'>Fechas y Partidos</h1>
                <div className='flex gap-1 flex-wrap bg-oscuro1 px-5 text-claro1 rounded-lg mb-2'>
                    {Array(cantPartidos).fill(0).map((x, i) =>
                        <div key={i + 1} onClick={cambioFecha} className='my-1'><h3 className={`${i == fecha - 1 ? activeTopicStyle : notActive}`}>{i + 1}</h3></div>
                    )}
                </div>
            </div>
            {partidosFecha.length > 0 ?
                (<table className='w-full'>
                    <thead className='font-thin bg-claro1 bg-opacity-30'>
                        <tr>
                            <th className='rounded-bl-md'>Estado</th>
                            <th>Local</th>
                            <th></th>
                            <th></th>
                            <th>Visitante</th>
                            <th>Dia</th>
                            <th>Hora</th>
                            <th className='rounded-br-md'>Predio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            partidosFecha.map((e, i) => (
                                <tr className='font-thin' key={i}>
                                    <th className='font-thin'>{e.estado}</th>
                                    <th className='font-thin'>{e.local_name}</th>
                                    <th className='font-thin'>{e.g_local}</th>
                                    <th className='font-thin'>{e.g_visitante}</th>
                                    <th className='font-thin'>{e.visitante_name}</th>
                                    <th className='font-thin'>{e.dia ? e.dia : 'a confirmar'}</th>
                                    <th className='font-thin'>{e.hora ? e.hora : 'a confirmar'}</th>
                                    <th className='font-thin'><Link href={e.predio_url ? e.predio_url : '#'} target={e.predio_url ? "_blank" : ''} style={e.predio_url ? { cursor: 'pointer' } : { cursor: 'default' }} >{e.predio_name ? e.predio_name : 'a confirmar'}</Link></th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>) : <h3 className='text-center p-6 font-black text-red-900'>a confirmar</h3>
            }
        </div >
    )
}
