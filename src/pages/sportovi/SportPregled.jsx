import { useEffect, useState } from "react"
import SportService from "../../services/sportovi/SportService"
import { Table } from "react-bootstrap"
import { FaCheckCircle, FaCloudSun, FaMinusCircle, FaRegBuilding } from "react-icons/fa"

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

    function checkKontaktni(kontaktni) {
        return kontaktni ? <FaCheckCircle size={25} color="green"/> : <FaMinusCircle size={25} color="red"/>
    }

    function checkUnutra(unutra) {
        return unutra ? <FaRegBuilding size={25}/> : <FaCloudSun size={25}/>
    }

    return(
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Vrsta Terena</th>
                        <th>Kontaktni</th>
                        <th>Max igrača</th>
                        <th>Unutra</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {sportovi && sportovi.map((sport) => (
                        <tr>
                            <td>{sport.naziv}</td>
                            <td>{sport.vrstaTerena}</td>
                            <td>
                                {checkKontaktni(sport.kontaktni)}
                            </td>
                            <td>{sport.maxIgraca}</td>
                            <td>
                                {checkUnutra(sport.unutra)}
                                </td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}