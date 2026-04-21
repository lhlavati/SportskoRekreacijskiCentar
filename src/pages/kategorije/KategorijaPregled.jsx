import { useEffect, useState } from "react"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { Button, Col, Row, Table } from "react-bootstrap"
import { FaEdit, FaTrash, FaTags } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function KategorijaPregled() {
    const navigate = useNavigate()
    const [kategorije, setKategorije] = useState([])
    const [sortPolje, setSortPolje] = useState('')
    const [sortSmjer, setSortSmjer] = useState('asc')

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

    function sortiraj(data) {
        if (!sortPolje) return data
        return [...data].sort((a, b) => {
            const av = (a[sortPolje] ?? '').toString()
            const bv = (b[sortPolje] ?? '').toString()
            const cmp = av.localeCompare(bv, 'hr', { sensitivity: 'base' })
            return sortSmjer === 'asc' ? cmp : -cmp
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

    const sortirani = sortiraj(kategorije)

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
                            <SortTh polje="naziv" tekst="Naziv" />
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortirani.map((kategorija) => (
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
                <div className="sort-traka mb-3">
                    <button
                        className={`sort-pill${sortPolje === 'naziv' ? ' sort-pill--aktivan' : ''}`}
                        onClick={() => klikniSort('naziv')}
                    >
                        Naziv{sortPolje === 'naziv' ? (sortSmjer === 'asc' ? ' ▲' : ' ▼') : ''}
                    </button>
                </div>

                <Row xs={1} sm={2} className="g-3">
                    {sortirani.map((kategorija) => (
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
