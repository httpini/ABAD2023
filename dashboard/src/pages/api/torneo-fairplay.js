// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";



export default async function handler(req, res) {
    let fp = await axios.get(`http://localhost:${process.env.PORT}/api/torneos/${req.body.torneo}`)

    res.status(200).json({ fair_play: fp.data.fair_play })

}