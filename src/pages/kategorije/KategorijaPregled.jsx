import { useEffect, useState } from "react"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { Button, Table } from "react-bootstrap"
import { FaCheckCircle, FaCloudSun, FaMinusCircle, FaRegBuilding } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import SportService from "../../services/sportovi/SportService"

export default function KategorijaPregled(){

    const navigate = useNavigate()
    const [kategorije, setKategorije] = useState([])
    const [sportovi, setSportovi] = useState([])

    useEffect(() => {
        ucitajKategorije()
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

    async function brisanje(id) {
        if (!confirm('Sigurno obrisati?')) return;
        await KategorijaService.obrisi(id);
        await KategorijaService.get().then((odgovor)=>{
            setKategorije(odgovor.data)
        })
    }

    function dohvatiVrstuKategorije(idSporta) {
        const sport = sportovi.find(s => s.id === idSporta)
        return sport ? sport.vrsta : 'Nepoznat sport'
    }

    return(
        <>
            <Link to={RouteNames.KATEGORIJE_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje nove kategorije
            </Link>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>Vrsta</th>
                        <th>Sport</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {kategorije && kategorije.map((kategorija) => (
                        <tr className="text-center" key={kategorija.id}>
                            <td className="lead">{kategorija.vrsta}</td>
                            <td>{dohvatiVrstuKategorije(kategorija.sport)}</td>
                            <td>
                                <Button onClick={()=>{navigate(`/kategorije/${kategorija.id}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{brisanje(kategorija.id)}}>
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