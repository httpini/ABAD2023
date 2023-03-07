import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProximosPartidos from "@/components/ProximosPartidos";

export default function Home() {
  return (
    <div className="h-screen">
      <Header />
      <Banner />
      <ProximosPartidos />
      <Footer />
    </div>
  )
}