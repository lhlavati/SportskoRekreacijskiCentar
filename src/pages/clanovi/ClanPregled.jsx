import { useEffect, useState } from "react"
import ClanService from "../../services/clanovi/ClanService"
import { Button, Col, Form, Row } from "react-bootstrap"
import { FaEdit, FaTrash, FaEnvelope, FaPhone, FaSearch } from "react-icons/fa"
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
    const [pretraga, setPretraga] = useState('')

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

    function filtriraj(data) {
        const pojam = pretraga.trim().toLowerCase()
        if (!pojam) return data
        return data.filter(c =>
            c.ime.toLowerCase().includes(pojam) ||
            c.prezime.toLowerCase().includes(pojam)
        )
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

    const prikaz = sortiraj(filtriraj(clanovi))

    return (
        <>
            <Link to={RouteNames.CLANOVI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje novog člana
            </Link>

            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                <div className="sort-traka flex-grow-1">
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

                <div className="position-relative" style={{ minWidth: 200 }}>
                    <Form.Control
                        type="text"
                        placeholder="Pretraži po imenu..."
                        value={pretraga}
                        onChange={e => setPretraga(e.target.value)}
                        style={{ paddingRight: 34, fontSize: '0.88rem' }}
                    />
                    <FaSearch
                        size={13}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--g-400)', pointerEvents: 'none' }}
                    />
                </div>
            </div>

            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {prikaz.map((clan) => (
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

                {prikaz.length === 0 && (
                    <Col xs={12}>
                        <p className="text-muted text-center py-4">Nema članova koji odgovaraju pretrazi.</p>
                    </Col>
                )}
            </Row>
        </>
    )
}
