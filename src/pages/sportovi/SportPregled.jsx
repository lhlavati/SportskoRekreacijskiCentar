import { useEffect, useState } from "react"
import SportService from "../../services/sportovi/SportService"
import { Button, Col, Row, Table } from "react-bootstrap"
import { FaCheckCircle, FaCloudSun, FaMinusCircle, FaRegBuilding, FaEdit, FaTrash, FaRunning } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"

const SORT_OPCIJE = [
    { polje: 'naziv', tekst: 'Naziv' },
    { polje: 'kategorija', tekst: 'Kategorija' },
    { polje: 'maxIgraca', tekst: 'Max igrača' },
    { polje: 'trajanjeMin', tekst: 'Trajanje' },
    { polje: 'cijenaTermina', tekst: 'Cijena' },
]

export default function SportPregled() {
    const navigate = useNavigate()
    const [sportovi, setSportovi] = useState([])
    const [kategorije, setKategorije] = useState([])
    const [sortPolje, setSortPolje] = useState('')
    const [sortSmjer, setSortSmjer] = useState('asc')

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

    function sortKljuc(sport, polje) {
        if (polje === 'kategorija') return dohvatiNazivKategorije(sport.kategorija)
        const v = sport[polje]
        return typeof v === 'string' ? v : (v ?? 0)
    }

    function sortiraj(data) {
        if (!sortPolje) return data
        return [...data].sort((a, b) => {
            const av = sortKljuc(a, sortPolje)
            const bv = sortKljuc(b, sortPolje)
            if (typeof av === 'string') {
                const cmp = av.localeCompare(bv, 'hr', { sensitivity: 'base' })
                return sortSmjer === 'asc' ? cmp : -cmp
            }
            if (av < bv) return sortSmjer === 'asc' ? -1 : 1
            if (av > bv) return sortSmjer === 'asc' ? 1 : -1
            return 0
        })
    }

    function klikniSort(polje) {
        if (sortPolje === polje) setSortSmjer(s => s === 'asc' ? 'desc' : 'asc')
        else { setSortPolje(polje); setSortSmjer('asc') }
    }

    function SortTh({ polje, tekst }) {
        const aktivan = sortPolje === polje
        return (
            <th className={`sort-th${aktivan ? ' sort-th--aktivan' : ''}`} onClick={() => klikniSort(polje)}>
                {tekst}<span className="sort-ikona">{aktivan ? (sortSmjer === 'asc' ? '▲' : '▼') : '⇅'}</span>
            </th>
        )
    }

    const sortirani = sortiraj(sportovi)

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
                            <SortTh polje="naziv" tekst="Naziv" />
                            <SortTh polje="kategorija" tekst="Kategorija" />
                            <th>Kontaktni</th>
                            <SortTh polje="maxIgraca" tekst="Max igrača" />
                            <th>U zatvorenom</th>
                            <SortTh polje="trajanjeMin" tekst="Trajanje (min)" />
                            <SortTh polje="cijenaTermina" tekst="Cijena (€)" />
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortirani.map((sport) => (
                            <tr className="text-center" key={sport.id}>
                                <td>{sport.naziv}</td>
                                <td>{dohvatiNazivKategorije(sport.kategorija)}</td>
                                <td>{checkKontaktni(sport.kontaktni)}</td>
                                <td>{sport.maxIgraca}</td>
                                <td>{checkUZatvorenom(sport.uZatvorenom)}</td>
                                <td>{sport.trajanjeMin}</td>
                                <td>{sport.cijenaTermina}</td>
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
                <div className="sort-traka mb-3">
                    {SORT_OPCIJE.map(({ polje, tekst }) => (
                        <button
                            key={polje}
                            className={`sort-pill${sortPolje === polje ? ' sort-pill--aktivan' : ''}`}
                            onClick={() => klikniSort(polje)}
                        >
                            {tekst}{sortPolje === polje ? (sortSmjer === 'asc' ? ' ▲' : ' ▼') : ''}
                        </button>
                    ))}
                </div>

                <Row xs={1} sm={2} className="g-3">
                    {sortirani.map((sport) => (
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
                                    <div className="pregled-kartica-row">
                                        <span className="pregled-kartica-label">Cijena termina</span>
                                        <span>{sport.cijenaTermina} €</span>
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
