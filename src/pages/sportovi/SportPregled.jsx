import { useEffect, useState } from "react"
import SportService from "../../services/sportovi/SportService"
import { Button, Col, Row, Table } from "react-bootstrap"
import { FaCheckCircle, FaCloudSun, FaMinusCircle, FaRegBuilding, FaEdit, FaTrash, FaRunning } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"

export default function SportPregled() {
    const navigate = useNavigate()
    const [sportovi, setSportovi] = useState([])
    const [kategorije, setKategorije] = useState([])

    useEffect(() => {
        ucitajKategorije()
        ucitajSportove()
    }, [])

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if (!odgovor.success) { alert('Nije implementiran servis'); return }
            setKategorije(odgovor.data)
        })
    }

    async function ucitajSportove() {
        await SportService.get().then((odgovor) => {
            if (!odgovor.success) { alert('Nije implementiran servis'); return }
            setSportovi(odgovor.data)
        })
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) return
        await SportService.obrisi(id)
        ucitajSportove()
    }

    function checkKontaktni(kontaktni) {
        return kontaktni
            ? <FaCheckCircle size={22} color="var(--g-600)" />
            : <FaMinusCircle size={22} color="#ef4444" />
    }

    function checkUZatvorenom(uZatvorenom) {
        return uZatvorenom ? <FaRegBuilding size={22} /> : <FaCloudSun size={22} />
    }

    function dohvatiNazivKategorije(idKategorije) {
        const k = kategorije.find((k) => k.id === parseInt(idKategorije))
        return k ? k.naziv : 'Nepoznata'
    }

    return (
        <>
            <Link to={RouteNames.SPORTOVI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje novog sporta
            </Link>

            {/* ── Tablica (md i veće) ── */}
            <div className="d-none d-md-block">
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
                                <td>{checkKontaktni(sport.kontaktni)}</td>
                                <td>{sport.maxIgraca}</td>
                                <td>{checkUZatvorenom(sport.uZatvorenom)}</td>
                                <td>{sport.trajanjeMin}</td>
                                <td>
                                    <Button size="sm" onClick={() => navigate(`/sportovi/${sport.id}`)}>Promjena</Button>
                                    &nbsp;&nbsp;
                                    <Button size="sm" variant="danger" onClick={() => obrisi(sport.id)}>Obriši</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* ── Grid kartice (ispod md) ── */}
            <div className="d-md-none">
                <Row xs={1} sm={2} className="g-3">
                    {sportovi && sportovi.map((sport) => (
                        <Col key={sport.id}>
                            <div className="pregled-kartica">
                                <div className="pregled-kartica-header">
                                    <FaRunning size={18} />
                                    {sport.naziv}
                                </div>
                                <div className="pregled-kartica-body">
                                    <div className="pregled-kartica-row">
                                        <span className="pregled-kartica-label">Kategorija</span>
                                        <span>{dohvatiNazivKategorije(sport.kategorija)}</span>
                                    </div>
                                    <div className="pregled-kartica-row">
                                        <span className="pregled-kartica-label">Kontaktni</span>
                                        {checkKontaktni(sport.kontaktni)}
                                    </div>
                                    <div className="pregled-kartica-row">
                                        <span className="pregled-kartica-label">Max igrača</span>
                                        <span>{sport.maxIgraca}</span>
                                    </div>
                                    <div className="pregled-kartica-row">
                                        <span className="pregled-kartica-label">Prostor</span>
                                        {checkUZatvorenom(sport.uZatvorenom)}
                                        <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                                            {sport.uZatvorenom ? 'Zatvoreno' : 'Otvoreno'}
                                        </span>
                                    </div>
                                    <div className="pregled-kartica-row">
                                        <span className="pregled-kartica-label">Trajanje</span>
                                        <span>{sport.trajanjeMin} min</span>
                                    </div>
                                </div>
                                <div className="pregled-kartica-actions">
                                    <Button size="sm" className="flex-fill" onClick={() => navigate(`/sportovi/${sport.id}`)}>
                                        <FaEdit className="me-1" />Promjena
                                    </Button>
                                    <Button size="sm" variant="danger" className="flex-fill" onClick={() => obrisi(sport.id)}>
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
