import { useEffect, useState } from "react"
import SportService from "../../services/sportovi/SportService"

export default function SportPregled(){

    const [sportovi, setSportovi] = useState([])

    useEffect(() => {
        ucitajSportove()
    }, [])

    async function ucitajSportove(){
        await SportService.get().then((odgovor) => {
            setSportovi(odgovor.data)
        })
    }

    return(
        <>
            <ul>
                {sportovi && sportovi.map((sport) => (
                    <li>{sport.naziv}</li>
                ))} 
            </ul>
        </>
    )
}