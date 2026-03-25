import { useEffect, useState } from "react"
import SportService from "../../services/sportovi/SportService"
import { Table } from "react-bootstrap"
import { FaCheckCircle, FaCloudSun, FaMinusCircle, FaRegBuilding } from "react-icons/fa"
import { Link } from "react-router-dom"
import { RouteNames } from "../../constants"

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

    function checkUZatvorenom(kontaktni) {
        return kontaktni ? <FaRegBuilding size={25}/> : <FaCloudSun size={25}/>
    }

    return(
        <>
            <Link to={RouteNames.SPORTOVI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje novog sporta
            </Link>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>Naziv</th>
                        <th>Kategorija</th>
                        <th>Kontaktni</th>
                        <th>Max igrača</th>
                        <th>U zatvorenom</th>
                        <th>Trajanje (min)</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {sportovi && sportovi.map((sport) => (
                        <tr className="text-center" key={sport.id}>
                            <td>{sport.naziv}</td>
                            <td>{sport.kategorija}</td>
                            <td>
                                {checkKontaktni(sport.kontaktni)}
                            </td>
                            <td>{sport.maxIgraca}</td>
                            <td>
                                {checkUZatvorenom(sport.uZatvorenom)}
                            </td>
                            <td>{sport.trajanjeMin}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}