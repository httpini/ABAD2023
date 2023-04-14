import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import axios, { all } from 'axios';
import Fechas from '@/components/Fechas';
import TablaPuntajes from '@/components/TablaPuntajes';
import Goleadores from '@/components/Goleadores';
import FairPlay from '@/components/FairPlay';
import Sanciones from '@/components/Sanciones';
import LinksTorneos from '@/components/LinksTorneos';
// import useMediaQuery from '../../../utils/useMediaQuery';
import {BiFootball} from "react-icons/bi"
 import {AiOutlineCloudDownload} from 'react-icons/ai'
import {GiInjustice} from 'react-icons/gi'
import { HiOutlineExternalLink } from "react-icons/hi"

const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
      if (e.matches) {
          setTargetReached(true);
      } else {
          setTargetReached(false);
      }
  }, []);

  useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addListener(updateTarget);

      // Check on mount (callback is not called until a change occurs)
      if (media.matches) {
          setTargetReached(true);
      }

      return () => media.removeListener(updateTarget);
  }, []);

  return targetReached;
};

export default function Torneo({ allTorneos, id, partidos, tabla, goleadores, fair_play, sanciones }) {
  const [title, setTitle] = useState('Torneo')
  const[reglamento, setReglamento]= useState("/")
  const isBreakpoint = useMediaQuery(400)

  useEffect(() => {
    let nombreTorneo = allTorneos.find(t => t.name_url == id)
    return setTitle(nombreTorneo.name);
  }, [id])

  useEffect(() => {
    let reglamento = allTorneos.find(t => t.name_url == id)
    if(reglamento.reglamento != null){
      return setReglamento(reglamento.reglamento);
    }
    
  }, [id])
  return (
    <div className='relative'>
      <Header allTorneos={allTorneos} />
      <section className='flex flex-col items-center'>
        <LinksTorneos torneos={allTorneos} id={id} hide={isBreakpoint}/>
        <h1 className='text-center font-bold text-2xl mt-4  text-oscuro0'><div className='flex justify-center items-center'><BiFootball></BiFootball>Torneo {title}<BiFootball></BiFootball></div></h1>
        <Link href={reglamento} target="_blank"><div className='drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)] shadow-blue-600/50 hover:text-claro1 ease-in duration-200 flex text-xl justify-center text-amarillo items-center gap-2 bg-oscuro1 w-59 p-2 text-center mt-3 rounded-xl' ><GiInjustice className='text-2xl '></GiInjustice><p>Reglamento</p><HiOutlineExternalLink className='text-2xl'></HiOutlineExternalLink></div></Link>
        <div className='flex flex-col break:grid grid-cols-2 justify w-full gap-7 justify-around py-7 sm:px-10'>
          <TablaPuntajes tabla={tabla} />
          <Fechas partidos={partidos} />
          <FairPlay fair_play={fair_play} />
          <Goleadores goleadores={goleadores} />
          <Sanciones sanciones={sanciones} />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export const getServerSideProps = async ({ params: { id } }) => {
  try {
    console.time('apis torneo id')

    let results = await Promise.all([
      axios.post('http://localhost:3500/api/partidos', { torneo: id }),
      axios.get('http://localhost:3500/api/torneos'),
      axios.post('http://localhost:3500/api/torneo-tabla', { torneo: id })
    ])
    
    let partidos = results[0]
    let allTorneos = results[1]
    let torneo = results[2]
    
    console.timeEnd('apis torneo id')
    return {
      props: {
        id,
        partidos: partidos.data.partidos,
        tabla: torneo.data.tabla,
        goleadores: torneo.data.goleadores,
        fair_play: torneo.data.fair_play,
        sanciones: torneo.data.sanciones,
        allTorneos: allTorneos.data.torneos
      }
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      }
    };
  }
}