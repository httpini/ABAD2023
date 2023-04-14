// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";


export default async function handler(req, res) {
  let equipos = await axios.get(`http://localhost:${process.env.PORT}/api/torneos/${req.body.torneo}`)
  // let equiposTorneo = equipos.data.filter(e => e.)
  // console.log(req.body);
  res.status(200).json({ equipos: equipos.data })
}
