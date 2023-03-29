import React from 'react'
// import { equipos } from '../../utils/constants'
import Link from 'next/link'

let equipos = [1, 2, 3, 4, 5, 6, 7]

export default function Fechas({ partidos }) {
    console.log(partidos);

    return (
        <div className='bg-blue-500 w-full'>
            <h1>Fechas</h1>
            <table className='w-full'>
                <thead className='bg-white'>
                    <tr>
                        <th>Fecha</th>
                        <th>Día</th>
                        <th>L/V</th>
                        <th>Resultado</th>
                        <th>Rival</th>
                        <th>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        partidos.map((e, i) => (
                            <tr key={i}>
                                <th>{e.fecha}</th>
                                <th>{e.dia}</th>
                                <th>{e.localVisitante}</th>
                                <th>{e.goles.equipo} - {e.goles.rival}</th>
                                <th>{e.rival}</th>
                                <th>{e.puntos != null ? e.puntos : '-'}</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div >
    )
}
