import Fechas from '@/components/Fechas'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import InformacionEquipo from '@/components/InformacionEquipo'
import LinksTorneos from '@/components/LinksTorneos'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import FechasEquipo from '@/components/FechasEquipo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LinksEquipos from '@/components/LinksEquipos'
import LinksTorneoEquipo from '@/components/LinksTorneoEquipo'

export default function ClubId({ id, club, equipos, torneos, equipoData }) {
  const [query, setQuery] = useState({})
  let router = useRouter();

  console.log('equipoData', equipoData);
  useEffect(() => {
    setQuery(router.query)
  }, [equipos, torneos])

  return (
    <div>
      <Header />
      <section className='w-full'>
        {/* <LinksTorneos torneos={torneos} id={id} /> */}
        <h2 className='text-2xl text-center'>Equipos</h2>
        <div className='flex flex-wrap w-full justify-around'>
          {
            equipos && equipos.map(e => (
              <LinksEquipos key={e.name_url} id={id} query={query} equipo={e} categoria={e.categoria} torneo={query.torneo} />
            ))
          }
        </div>
        <h2 className='text-2xl text-center'>Torneos</h2>
        <div className='flex flex-wrap w-full justify-around'>
          {
            torneos && torneos.map(t => (
              <LinksTorneoEquipo key={t.name_url} query={query} torneo={t} />
            ))
          }
        </div>
        {
          equipoData && (
            <div className='grid md:grid-cols-2 w-full flex-wrap gap-10 justify-around p-10'>
              <InformacionEquipo />
              <FechasEquipo partidos={equipoData.equipos.partidos} />
            </div>
          )
        }
      </section>
      <Footer />
    </div>
  )
}


export const getServerSideProps = async ({ params: { id }, query: { torneo, equipo } }) => {
  let clubData = await axios.post('http://localhost:3500/api/club-url', { club: id })
  // console.log(torneo, equipo);
  let equipoData
  if (torneo && equipo) equipoData = await axios.post(`http://localhost:3500/api/equipo-torneo`, { torneo, equipo })
  // console.log(equipoData.data);
  // let dataEquipo = calls[1]
  // console.log(dataClub.data.club.equipos, equipo);
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
  // console.log(equipoData.data);
  if (equipoData) props.equipoData = equipoData.data


  return {
    props
  }
}