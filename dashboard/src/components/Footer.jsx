import Link from 'next/link'
import React, { useState } from 'react'
import { BsInstagram } from 'react-icons/bs'
import { MdOutlineRadio } from 'react-icons/md'
import { GoFileCode } from 'react-icons/go'
import FadeInOut from './FadeInOut'

export default function Footer() {
  const [show, setShow] = useState(false);
  const email = 'estfersomoza@gmail.com , nicolas.pinol@hotmail.com'

  function copyEmail() {
    navigator.clipboard.writeText(email)
    setShow(true)
    setTimeout(() => {
      console.log('timer');
      setShow(false)
    }, 3000)
  }

  return (
    <div className='z-50 mb-auto sticky bottom-0 w-[100vw] bg-oscuro1 text-amarillo flex justify-around items-center p-2 h-[50px]'>
      <Link href={'/nosotros'} className='text-sm grow-1 text-center'>Más sobre nosotros</Link>
      <div className='flex items-center justify-evenly gap-3 mini:gap-10'>
        <Link href='https://www.instagram.com/abadfutbol/' target='_blank'><BsInstagram /></Link>
        <Link href='https://www.radiodelpueblo.com.ar/' target='_blank'><MdOutlineRadio /></Link>
      </div>
      {show && <FadeInOut show={show} duration={500} className='absolute right-8 bottom-20 w-[250px] text-center bg-oscuro1 p-3 rounded-2xl bg-opacity-75'>
        ¡email de desarrolladores copiado al portapapeles!
      </FadeInOut>}
      <p onClick={copyEmail} className='text-xs text-center cursor-pointer'>desarrollo web <GoFileCode className='inline' /></p>
    </div>
  )
}
