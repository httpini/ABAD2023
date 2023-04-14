// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
// import dotenv from 'dotenv';
// let port = dotenv.config({ path: '../.env' });
// console.log(port.parsed.PORT);


export default async function handler(req, res) {
    console.log(process.env.PORT);
    let partidos = await axios.get(`http://localhost:${process.env.PORT}/api/partidosConfirmados`)
    res.status(200).json({ partidos: partidos.data.partidos })
}
