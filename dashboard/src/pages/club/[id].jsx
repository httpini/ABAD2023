import Footer from '@/components/Footer'
import Header from '@/components/Header'
import InformacionEquipo from '@/components/InformacionEquipo'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import FechasEquipo from '@/components/FechasEquipo'
import LinksEquipos from '@/components/LinksEquipos'
import LinksTorneoEquipo from '@/components/LinksTorneoEquipo'
import GoleadoresSanciones from '@/components/GoleadoresSanciones'
import { useRouter } from 'next/router'
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'


export default function ClubId({ id, club, equipos, torneos, equipo }) {
  const [query, setQuery] = useState({})
  const [equ, setEqu] = useState({})
  const [torn, setTorn] = useState({})
  let router = useRouter();

  useEffect(() => {
    if (router.query.equipo) setEqu(equipos.find(e => e.name_url === router.query.equipo));
    if (router.query.torneo) setTorn(torneos.find(t => t.name_url === router.query.torneo));
    setQuery(router.query)
  }, [equipos, torneos, query])

  return (
    <div>
      <Header />
      {/* <ColoresEquipo colores={equipo.equipo.colores} width={100} height={100}/> */}
      <section className='w-full'>
        {/* <LinksTorneos torneos={torneos} id={id} /> */}
        <h2 className='text-2xl text-center mt-5 text-oscuro0 my-3'>Equipo/s de {club.name}</h2>
        <div className='flex flex-wrap w-full justify-center px-5 gap-3'>
          {
            equipos && equipos.map(e => (
              <LinksEquipos key={e.name_url} id={id} query={query} equipo={e} categoria={e.categoria} torneo={query.torneo} />
            ))
          }
        </div>
        {
          torneos &&
          <div>
            <h2 className='text-2xl text-center my-5 text-oscuro0'>Torneo/s en disputa</h2>
            <div className='flex flex-wrap w-full justify-center px-5 gap-3'>
              {
                torneos.map(t => (
                  <LinksTorneoEquipo key={t.name_url} query={query} torneo={t} />
                ))
              }
            </div>
          </div>
        }

        {
          equipo && (
            <div className='flex flex-col break:grid grid-cols-2 w-full flex-wrap gap-10 justify-around py-10 sm:px-10'>
              <InformacionEquipo torneo={torn} nombreEquipo={equ.name} equipo={equipo.equipo} fairPlay={equipo.fair_play} goleadores={equipo.goleadores} tabla={equipo.tabla} sancionados={equipo.sancionados} />
              <FechasEquipo partidos={equipo.partidos} />
              <GoleadoresSanciones nombreTorneo={torn.name} nombreEquipo={equ.name} equipo={equipo.equipo} fairPlay={equipo.fair_play} goleadores={equipo.goleadores} tabla={equipo.tabla} sancionados={equipo.sancionados} />
            </div>
          )
        }
      </section>
      <Footer />
    </div>
  )
}


export const getServerSideProps = async ({ params: { id }, query: { torneo, equipo } }) => {
  try {
    console.time('apis club id')
    let clubData = await axios.post('http://localhost:3500/api/club-url', { club: id })

    if (!clubData) {
      return redirect('/asdf');
    }

    let primerEquipo = clubData.data.club?.equipos[0]?.name_url
    let primerTorneo = clubData.data.club?.equipos[0]?.torneos[0].name_url

    if (!torneo && !equipo) {
      return {
        redirect: {
          destination: `/club/${id}?equipo=${primerEquipo}&torneo=${primerTorneo}`,
          permanent: false,
        }
      }
    }

    let equipoSelecto = clubData.data.club.equipos.find(c => c.name_url === equipo)

    if (equipo && !torneo) {
      return {
        redirect: {
          destination: `/club/${id}?equipo=${equipo}&torneo=${equipoSelecto.torneos[0].name_url}`,
          permanent: false,
        }
      }
    }

    let equipoData
    if (torneo && equipo) equipoData = await axios.post(`http://localhost:3500/api/equipo-torneo`, { torneo, equipo })

    if (clubData == null) redirect('/')

    let torneos
    if (equipo) {
      torneos = clubData.data.club.equipos.find(e => e.name_url === equipo).torneos
    }

    let props = {
      id,
      club: clubData.data.club.club,
      equipos: clubData.data.club.equipos
    }

    if (torneos) props.torneos = torneos
    if (equipoData) props.equipo = equipoData.data.equipos

    console.timeEnd('apis club id')

    return {
      props
    }
  } catch (error) {
    console.log('error', error);
    return {
      redirect: {
        permanent: false,
        destination: "/club",
      }
    };
  }
}