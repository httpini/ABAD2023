import React from 'react'
import { equipos } from '../../utils/constants'
import Link from 'next/link'

export default function FairPlay({fair_play}) {
  return (
    <div className='tarjeta shadow-md shadow-oscuro3'>
            <h1 className='text-center font-bold text-xl border-b-2 border-oscuro1'>Fair Play</h1>
            <table className='w-full'>
                <thead className='bg-white'>
                    <tr>
                        <th>#</th>
                        <th>Equipo</th>
                        <th>Puntos</th>
                        <th>Amarillas</th>
                        <th>Rojas</th>
                        <th>Amonestaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        fair_play && fair_play.map((fp, i) => (
                            <tr key={i}>
                                <th>{i+1}</th>
                                {/*LO MISMO FALTA PONERLE COLORES A LOS EQUIPOS*/}
                                <th><Link href={`/club/${fp.equipo}`}>{fp.equipo}</Link></th>
                                <th>{fp.puntos}</th>
                                <th>{fp.amarillas}</th>
                                <th>{fp.rojas}</th>
                                <th>{fp.amonestaciones}</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
  )
}
