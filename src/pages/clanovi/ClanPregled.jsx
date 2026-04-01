import { useEffect, useState } from "react"
import ClanService from "../../services/clanovi/ClanService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function ClanPregled(){

    const navigate = useNavigate()
    const [clanovi, setClanovi] = useState([])

    useEffect(() => {
        ucitajClanove()
    }, [])

    async function ucitajClanove(){
        await ClanService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setClanovi(odgovor.data)
        })
    }

    async function obrisi(id) {
        if(!confirm('Sigurno obrisati?')){
            return
        }
        await ClanService.obrisi(id)
        ucitajClanove()
    }

    return(
        <>
            <Link to={RouteNames.CLANOVI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje novog člana
            </Link>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>E-mail</th>
                        <th>Kontakt broj</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {clanovi && clanovi.map((clan) => (
                        <tr className="text-center" key={clan.id}>
                            <td>{clan.ime}</td>
                            <td>{clan.prezime}</td>
                            <td>{clan.email}</td>
                            <td>{clan.kontaktBroj}</td>
                            <td>
                                <Button onClick={()=>{navigate(`/clanovi/${clan.id}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(clan.id)}}>
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