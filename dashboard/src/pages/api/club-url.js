// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import { redirect } from 'next/navigation';


export default async function handler(req, res) {
    try {
        // console.log(process.env.PORT);
        let club = await axios.get(`http://localhost:${process.env.PORT}/api/clubes/${req.body.club}`)
        // console.log('bluib', club);
        res.status(200).json({ club: club.data })
    } catch (error) {
        // console.log('bol');
        res.status(404).json()
        // redirect('/');
    }
}
