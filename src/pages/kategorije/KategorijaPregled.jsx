import { useEffect, useState } from "react"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { Button, Col, Row, Table } from "react-bootstrap"
import { FaEdit, FaTrash, FaTags } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function KategorijaPregled() {
    const navigate = useNavigate()
    const [kategorije, setKategorije] = useState([])

    useEffect(() => {
        ucitajKategorije()
    }, [])

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if (!odgovor.success) { alert('Nije implementiran servis'); return }
            setKategorije(odgovor.data)
        })
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) return
        await KategorijaService.obrisi(id)
        await KategorijaService.get().then((odgovor) => setKategorije(odgovor.data))
    }

    return (
        <>
            <Link to={RouteNames.KATEGORIJE_NOVI} className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje nove kategorije
            </Link>

            {/* ── Tablica (md i veće) ── */}
            <div className="d-none d-md-block">
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Naziv</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kategorije && kategorije.map((kategorija) => (
                            <tr className="text-center" key={kategorija.id}>
                                <td className="lead">{kategorija.naziv}</td>
                                <td>
                                    <Button size="sm" onClick={() => navigate(`/kategorije/${kategorija.id}`)}>Promjena</Button>
                                    &nbsp;&nbsp;
                                    <Button size="sm" variant="danger" onClick={() => obrisi(kategorija.id)}>Obriši</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* ── Grid kartice (ispod md) ── */}
            <div className="d-md-none">
                <Row xs={1} sm={2} className="g-3">
                    {kategorije && kategorije.map((kategorija) => (
                        <Col key={kategorija.id}>
                            <div className="pregled-kartica">
                                <div className="pregled-kartica-header">
                                    <FaTags size={16} />
                                    {kategorija.naziv}
                                </div>
                                <div className="pregled-kartica-actions">
                                    <Button size="sm" className="flex-fill" onClick={() => navigate(`/kategorije/${kategorija.id}`)}>
                                        <FaEdit className="me-1" />Promjena
                                    </Button>
                                    <Button size="sm" variant="danger" className="flex-fill" onClick={() => obrisi(kategorija.id)}>
                                        <FaTrash className="me-1" />Obriši
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}
