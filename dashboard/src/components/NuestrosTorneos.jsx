import React from 'react'
import cancha from '../../public/cancha.jpg'
import Image from 'next/image'

export default function NuestrosTorneos() {
    return (
        <div className='px-5 mini:px-[25px] md:px-[75px] bg-oscuro3 h-full flex items-center flex-wrap md:flex-nowrap'>
            {/* <div className='flex xl:block items-center'> */}
                <div className='mt-10 flex items-start flex-wrap md:flex-nowrap justify-center w-full xl:pb-20'>
                    <div className='w-full'>
                        <h2 className='text-2xl font-bold mb-5 text-amarillo drop-shadow-lg shadow-oscuro1'>Nuestros Torneos</h2>
                        <p className='text-sm w-[100%] md:w-[70%] xl:w-[70%]'> Participan anualmente un total de 80 equipos divididos en cuatro categorías</p>
                        <br />
                        <p>- Libres (sin límite de edad)</p>
                        <p>- Seniors (mayores de 37 años)</p>
                        <p>- Super Seniors (mayores de 48 años)</p>
                        <p>- Femenino (sin límite de edad)</p>
                    </div>
                </div>
                <div className='pb-10 md:pb-0'>
                    <Image src={cancha} className='max-h-[200px] object-cover rounded-3xl' />
                </div>
            {/* </div> */}
        </div>
    )
}
