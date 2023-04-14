import React, { useState, useEffect, useRef } from 'react'
import { HiMenuAlt4 } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import LinkHeader from './LinkHeader'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import ABADlogo from '../../public/ABADlogo.svg'


export default function Header({ allTorneos }) {
    const [toggleMenu, setToggleMenu] = useState(false)
    const [torn, setTorn] = useState([])

    useEffect(() => {
        let fetch = async () => {
            let data = await axios.get('http://localhost:3500/api/torneos')
            setTorn(data.data.torneos)
        }
        fetch()
    }, [])

    function onClick() {
        window.location.href = "/"
    }

    return (
        <div className='flex w-full flex-row justify-around h-[75px] items-center bg-oscuro1 shadow-md shadow-oscuro1 text-[#fdf0d5]  fixed z-50'>
            <Link href='/'>
                <h1 className='mx-[5em]'><Image rel="preload" priority={true} alt='logo' className='w-[45px]' src={ABADlogo}></Image></h1>
            </Link>
            <div className='md:flex hidden justify-around flex-grow'>
                {/* <LinkHeader texto='Copas' lista={copas} pagina='copa' /> */}
            </div>

            <div className='text-4xl'>
                {toggleMenu ?
                    <AiOutlineClose fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMenu(false)} />
                    : <HiMenuAlt4 fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMenu(true)} />}
                {toggleMenu && (
                    <div className='relative'>

                        <ul className={`z-10 fixed top-0 -right-0 p-3 w-[50%] h-screen shadow-2xl shadow-oscuro1 md:hidden list-none 
                    flex flex-col justify-start items-end bg-oscuro1 text-white ${toggleMenu ? 'animate-slide-in' : 'animate-slide-out'}`}>
                            <li className='text-4xl w-full my-2'>
                                <AiOutlineClose onClick={() => setToggleMenu(false)} />
                            </li>

                            <div className='flex flex-col gap-10 align-bottom text-right text-xl'>
               <Link href='/' className='hover:text-claro1 cursor-pointer pr-3'>Inicio</Link>

                                <LinkHeader texto='Torneos' lista={[torn]} pagina='torneo' hide={true} />
                                {/* <LinkHeader texto='Copas' lista={copas} pagina='copa' /> */}
                                <LinkHeader texto='Clubes' lista={[]} pagina='club' />
                                <LinkHeader texto='Nosotros' lista={[]} pagina='nosotros' />
                            </div>
                        </ul>
                        {/* <Image rel="preload" priority={true} alt='logo' className='w-[45px] z-20 sticky bottom-10' src={ABADlogo}></Image> */}
                    </div>
                )}
            </div>

            <div className='md:flex hidden justify-around flex-grow text-xl'>
                <LinkHeader texto='Torneos' lista={torn} pagina='torneo' />

                <LinkHeader texto='Clubes' lista={[]} pagina='club' />
                <LinkHeader texto='Nosotros' lista={[]} pagina='nosotros' />
            </div>
        </div>
    )
}

