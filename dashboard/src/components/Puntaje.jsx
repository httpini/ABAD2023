import React from 'react'
import ColoresEquipo from './ColoresEquipo'

export default function Puntaje({ equipo, goles, colores, local }) {
    return (
        <div className={`h-full w-full flex-wrap flex justify-start`}>
            <div className='flex w-full flex-wrap flex-col justify-center items-center'>
                {/* {
                    (!local && colores.length > 0) && <ColoresEquipo colores={colores} />
                } */}
                <h6 className='text-center text-sm w-full mini:text-base'>{equipo}</h6>
                {/* {
                    (local && colores.length > 0) && <ColoresEquipo colores={colores} />
                } */}
                {
                    (goles == undefined && colores.length > 0) && <ColoresEquipo colores={colores} />
                }
            </div>
            {
                goles != undefined && (<span className='w-[100%] block text-center text-4xl'>{goles}</span>)
            }
        </div>
    )
}
