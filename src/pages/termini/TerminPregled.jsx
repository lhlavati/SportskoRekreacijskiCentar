import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import TerminService from "../../services/termini/TerminService"; 

export default function TerminPregled(){

    const navigate = useNavigate()
    const [termini, setTermini] = useState([])

    useEffect(() => {
        ucitajTermine()
    }, [])

    async function ucitajTermine(){
        await TerminService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setTermini(odgovor.data)
        })
    }

    async function obrisi(id) {
        if(!confirm('Sigurno obrisati?')){
            return
        }
        await TerminService.obrisi(id)
        ucitajTermine()
    }

    return(
        <>
            <Link to={RouteNames.TERMINI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje novog termina
            </Link>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>Datum početka termina</th>
                        <th>Datum kraja termina</th>
                        <th>Cijena</th>
                        <th>Rezervirao</th>
                        <th>Sudionici</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {termini && termini.map((termin) => (
                        <tr className="text-center" key={termin.id}>
                            <td>{termin.datumPocetka}</td>
                            <td>{termin.datumKraja}</td>
                            <td>{termin.cijena}</td>
                            <td>{termin.rezervirao}</td>
                            <td>{termin.sudionici}</td>
                            <td>
                                <Button onClick={()=>{navigate(`/termini/${termin.id}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(termin.id)}}>
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