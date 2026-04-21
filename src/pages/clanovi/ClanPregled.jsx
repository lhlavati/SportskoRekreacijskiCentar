import { useEffect, useState } from "react"
import ClanService from "../../services/clanovi/ClanService"
import { Button, Col, Row, Table } from "react-bootstrap"
import { FaEdit, FaTrash, FaEnvelope, FaPhone } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

const SORT_OPCIJE = [
    { polje: 'ime', tekst: 'Ime' },
    { polje: 'prezime', tekst: 'Prezime' },
    { polje: 'email', tekst: 'E-mail' },
]

export default function ClanPregled() {
    const navigate = useNavigate()
    const [clanovi, setClanovi] = useState([])
    const [sortPolje, setSortPolje] = useState('')
    const [sortSmjer, setSortSmjer] = useState('asc')

    useEffect(() => {
        ucitajClanove()
    }, [])

    async function ucitajClanove() {
        await ClanService.get().then((odgovor) => {
            if (!odgovor.success) { alert('Nije implementiran servis'); return }
            setClanovi(odgovor.data)
        })
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) return
        await ClanService.obrisi(id)
        ucitajClanove()
    }

    function inicijali(clan) {
        return `${(clan.ime?.[0] ?? '?')}${(clan.prezime?.[0] ?? '')}`.toUpperCase()
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

    const sortirani = sortiraj(clanovi)

    return (
        <>
            <Link to={RouteNames.CLANOVI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje novog člana
            </Link>

            {/* ── Reset sortiranja (desktop) ── */}
            {sortPolje && (
                <div className="d-none d-md-flex align-items-center gap-2 mb-2">
                    <span className="text-muted small">
                        Sortirano po: <strong>{SORT_OPCIJE.find(o => o.polje === sortPolje)?.tekst}</strong> {sortSmjer === 'asc' ? '▲' : '▼'}
                    </span>
                    <button className="sort-pill sort-pill--reset" onClick={() => setSortPolje('')}>× Poništi</button>
                </div>
            )}

            {/* ── Tablica (md i veće) ── */}
            <div className="d-none d-md-block">
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <SortTh polje="ime" tekst="Ime" />
                            <SortTh polje="prezime" tekst="Prezime" />
                            <SortTh polje="email" tekst="E-mail" />
                            <th>Kontakt broj</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortirani.map((clan) => (
                            <tr className="text-center" key={clan.id}>
                                <td>{clan.ime}</td>
                                <td>{clan.prezime}</td>
                                <td>{clan.email}</td>
                                <td>{clan.kontaktBroj}</td>
                                <td>
                                    <Button size="sm" onClick={() => navigate(`/clanovi/${clan.id}`)}>Promjena</Button>
                                    &nbsp;&nbsp;
                                    <Button size="sm" variant="danger" onClick={() => obrisi(clan.id)}>Obriši</Button>
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
                    {sortPolje && (
                        <button className="sort-pill sort-pill--reset" onClick={() => setSortPolje('')}>× Poništi</button>
                    )}
                </div>

                <Row xs={1} sm={2} className="g-3">
                    {sortirani.map((clan) => (
                        <Col key={clan.id}>
                            <div className="pregled-kartica">
                                <div className="pregled-kartica-header">
                                    <div className="clan-avatar">{inicijali(clan)}</div>
                                    <span>{clan.ime} {clan.prezime}</span>
                                </div>
                                <div className="pregled-kartica-body">
                                    <div className="pregled-kartica-row">
                                        <FaEnvelope size={14} color="var(--g-600)" style={{ flexShrink: 0 }} />
                                        <span className="text-truncate" style={{ fontSize: '0.88rem' }}>{clan.email}</span>
                                    </div>
                                    <div className="pregled-kartica-row">
                                        <FaPhone size={14} color="var(--g-600)" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.88rem' }}>{clan.kontaktBroj}</span>
                                    </div>
                                </div>
                                <div className="pregled-kartica-actions">
                                    <Button size="sm" className="flex-fill" onClick={() => navigate(`/clanovi/${clan.id}`)}>
                                        <FaEdit className="me-1" />Promjena
                                    </Button>
                                    <Button size="sm" variant="danger" className="flex-fill" onClick={() => obrisi(clan.id)}>
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
