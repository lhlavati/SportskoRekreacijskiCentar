import { useEffect, useState } from "react"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { Button, Table } from "react-bootstrap"
import { FaCheckCircle, FaCloudSun, FaMinusCircle, FaRegBuilding } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function KategorijaPregled(){

    const navigate = useNavigate()
    const [kategorija, setKategorija] = useState([])

    useEffect(() => {
        ucitajKategorije()
    }, [])

    async function ucitajKategorije(){
        await KategorijaService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKategorija(odgovor.data)
        })
    }

    async function brisanje(id) {
        if (!confirm('Sigurno obrisati?')) return;
        await KategorijaService.obrisi(id);
        await KategorijaService.get().then((odgovor)=>{
            setKategorija(odgovor.data)
        })
    }

    return(
        <>
            <Link to={RouteNames.KATEGORIJE_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje nove kategorije
            </Link>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>Naziv</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {kategorija && kategorija.map((kategorija) => (
                        <tr className="text-center" key={kategorija.id}>
                            <td className="lead">{kategorija.naziv}</td>
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