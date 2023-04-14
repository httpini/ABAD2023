import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProximosPartidos from "@/components/ProximosPartidos";
import axios from "axios";

export default function Home({ partidosConfirmados, partidosDisputados }) {
  // console.log(partidosConfirmados, partidosDisputados);
  return (
    <div className="h-screen relative">
      <Header />
      <section>
        <Banner />
        <div>

          {
            partidosConfirmados &&
            <>
              <h2 className="font-bold text-center p-3 text-2xl font-bold text-center text-amarillo drop-shadow-[0_3.2px_1.2px_rgba(0,0,0,0.8)] shadow-blue-600/50">Partidos a jugar</h2>
              <ProximosPartidos data={partidosConfirmados} />
            </>

          }
          <br />
          {
            partidosConfirmados &&
            <>
              <h2 className="font-bold text-center p-3 text-2xl font-bold text-center text-amarillo drop-shadow-[0_3.2px_1.2px_rgba(0,0,0,0.8)] shadow-blue-600/50">Partidos jugados</h2>
              <ProximosPartidos data={partidosDisputados} />
            </>
          }
        </div>

      </section>
      <Footer />
    </div>
  )
}


export const getServerSideProps = async () => {
  try {
    console.time('apis index')
    let calls = await Promise.all([
      axios.get('http://localhost:3500/api/partidos-disputados'),
      axios.get('http://localhost:3500/api/partidos-confirmados')
    ])
    
    console.timeEnd('apis index')
    return {
      props: {
        partidosDisputados: calls[0].data,
        partidosConfirmados: calls[1].data
      }
    }
  } catch (error) {
    console.log(error);
  }
}