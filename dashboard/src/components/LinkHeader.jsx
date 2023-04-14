import Link from 'next/link'
import React, { useEffect, useState } from 'react'


export default function LinkHeader({ texto, lista, pagina, hide }) {
    const [list, setList] = useState([])
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setList(lista)
    }, [lista])

    return (
        <div className='relative'>
            <Link href={`/${pagina}${lista?.length ? '/' + lista[0].name_url : ''}`} className='hover:text-claro1 cursor-pointer pr-3 py-5' onMouseEnter={() => { if (list.length) setVisible(true) }} onMouseLeave={() => setVisible(false)}>{texto}</Link>
            {(!hide && visible) && (
                <div onMouseEnter={() => { setVisible(true) }} onMouseLeave={() => setVisible(false)}
                    className='relative md:absolute  bg-oscuro1 w-[350px] left-[-125%] text-center p-2 text-ellipsis rounded-b-2xl shadow-2xl shadow-oscuro1'>
                    {list && list.map(l => (<Link href={`/${pagina}/${l.name_url}`} key={l.name_url} className='text-center text-ellipsis w-full block hover:text-claro1'>{`${l.name}`}</Link>))}
                </div>)
            }
        </div>
    )
}
