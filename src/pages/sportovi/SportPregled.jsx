import { useEffect, useState } from "react"
import SportService from "../../services/sportovi/SportService"
import { Button, Table } from "react-bootstrap"
import { FaCheckCircle, FaCloudSun, FaMinusCircle, FaRegBuilding } from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"

export default function SportPregled(){

    const navigate = useNavigate()
    const [sportovi, setSportovi] = useState([])
    const [kategorije, setKategorije] = useState([])
    
    useEffect(() => {
        ucitajKategorije(),
        ucitajSportove()
    }, [])

    async function ucitajKategorije(){
        await KategorijaService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKategorije(odgovor.data)
        })
    }

    async function ucitajSportove(){
        await SportService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setSportovi(odgovor.data)
        })
    }

    async function obrisi(id) {
        if(!confirm('Sigurno obrisati?')){
            return
        }
        await SportService.obrisi(id)
        ucitajSportove()
    }

    function checkKontaktni(kontaktni) {
        return kontaktni ? <FaCheckCircle size={25} color="green"/> : <FaMinusCircle size={25} color="red"/>
    }

    function checkUZatvorenom(kontaktni) {
        return kontaktni ? <FaRegBuilding size={25}/> : <FaCloudSun size={25}/>
    }

    function dohvatiNazivKategorije(idKategorije) {
        const kategorija = kategorije.find((k) => k.id === parseInt(idKategorije))

        return kategorija ? kategorija.naziv : 'Nepoznata kategorija'
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
                            <td>{dohvatiNazivKategorije(sport.kategorija)}</td>
                            <td>
                                {checkKontaktni(sport.kontaktni)}
                            </td>
                            <td>{sport.maxIgraca}</td>
                            <td>
                                {checkUZatvorenom(sport.uZatvorenom)}
                            </td>
                            <td>{sport.trajanjeMin}</td>
                            <td>
                                <Button onClick={()=>{navigate(`/sportovi/${sport.id}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(sport.id)}}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}