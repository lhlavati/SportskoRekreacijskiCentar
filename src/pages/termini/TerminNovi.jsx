import { Badge, Button, Col, Form, ListGroup, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import TerminService from "../../services/termini/TerminService"
import { useEffect, useRef, useState } from "react"
import SportService from "../../services/sportovi/SportService"
import ClanService from "../../services/clanovi/ClanService"
import { FaTimes, FaEuroSign } from "react-icons/fa"

const SATI = Array.from({ length: 14 }, (_, i) => i + 8)

function satGramatika(n) {
    if (n === 1) return 'sat'
    if (n >= 2 && n <= 4) return 'sata'
    return 'sati'
}

export default function TerminNovi() {

    const [sportovi, setSportovi] = useState([])
    const [clanovi, setClanovi] = useState([])
    const [pretraga, setPretraga] = useState('')
    const [odabraniClan, setOdabraniClan] = useState(null)
    const [prikaziDropdown, setPrikaziDropdown] = useState(false)

    const [pretragaSudionika, setPretragaSudionika] = useState('')
    const [odabraniSudionici, setOdabraniSudionici] = useState([])
    const [prikaziDropdownSudionici, setPrikaziDropdownSudionici] = useState(false)

    const [odabraniDatum, setOdabraniDatum] = useState('')
    const [odabraniSport, setOdabraniSport] = useState('')
    const [odabraniSati, setOdabraniSati] = useState([])
    const [zauzetiSati, setZauzetiSati] = useState([])
    const [ucitavamTermine, setUcitavamTermine] = useState(false)
    const refDatum = useRef(null)

    const filtriraneClanovi = pretraga.length > 0
        ? clanovi.filter(c =>
            (c.ime.toLowerCase().includes(pretraga.toLowerCase()) ||
            c.prezime.toLowerCase().includes(pretraga.toLowerCase())) &&
            !odabraniSudionici.some(s => s.id === c.id)
        )
        : []

    const filtriraneSudionici = pretragaSudionika.length > 0
        ? clanovi.filter(c =>
            (c.ime.toLowerCase().includes(pretragaSudionika.toLowerCase()) ||
            c.prezime.toLowerCase().includes(pretragaSudionika.toLowerCase())) &&
            c.id !== odabraniClan?.id &&
            !odabraniSudionici.some(s => s.id === c.id)
        )
        : []

    const navigate = useNavigate()

    useEffect(() => {
        ucitajSportove()
        ucitajClanove()
    }, [])

    useEffect(() => {
        if (!odabraniDatum || !odabraniSport) {
            setZauzetiSati([])
            return
        }
        ucitajZauzeteSate()
    }, [odabraniDatum, odabraniSport])

    async function ucitajZauzeteSate() {
        setUcitavamTermine(true)
        const odgovor = await TerminService.get()
        setUcitavamTermine(false)
        if (!odgovor.success) return
        const sati = []
        odgovor.data
            .filter(t => t.datum === odabraniDatum && t.sport === parseInt(odabraniSport))
            .forEach(t => { sati.push(...(t.odabraniSati ?? [])) })
        setZauzetiSati([...new Set(sati)])
    }

    async function dodaj(termin) {
        await TerminService.dodaj(termin).then(() => {
            navigate(RouteNames.TERMINI)
        })
    }

    async function ucitajSportove() {
        await SportService.get().then((odgovor) => {
            if (!odgovor.success) { alert('Nije implementiran servis'); return }
            setSportovi(odgovor.data)
        })
    }

    async function ucitajClanove() {
        await ClanService.get().then((odgovor) => {
            if (odgovor.success) setClanovi(odgovor.data)
        })
    }

    function dodajSudionika(clan) {
        setOdabraniSudionici(prev => [...prev, clan])
        setPretragaSudionika('')
        setPrikaziDropdownSudionici(false)
    }

    function ukloniSudionika(id) {
        setOdabraniSudionici(prev => prev.filter(c => c.id !== id))
    }

    function toggleSat(sat) {
        setOdabraniSati(prev =>
            prev.includes(sat)
                ? prev.filter(s => s !== sat)
                : [...prev, sat].sort((a, b) => a - b)
        )
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        const sport = podaci.get('sport')

        if (!odabraniDatum) {
            alert("Datum je obavezan!")
            return
        }
        if (odabraniDatum < new Date().toISOString().slice(0, 10)) {
            alert("Datum ne može biti u prošlosti!")
            return
        }
        if (odabraniSati.length === 0) {
            alert("Morate odabrati barem jedan sat!")
            return
        }
        if (!odabraniClan) {
            alert("Morate odabrati člana koji rezervira!")
            return
        }
        if (odabraniSudionici.length === 0) {
            alert("Morate odabrati barem jednog sudionika!")
            return
        }
        if (!sport) {
            alert("Niste odabrali važeći sport!")
            return
        }

        const sortirani = [...odabraniSati].sort((a, b) => a - b)
        const odabraniSportObj = sportovi.find(s => s.id === parseInt(sport))
        const ukupnaCijena = sortirani.length * (odabraniSportObj?.cijenaTermina ?? 0)

        dodaj({
            datum: odabraniDatum,
            odabraniSati: sortirani,
            ukupnaCijena,
            rezervirao: odabraniClan.id,
            sudionici: odabraniSudionici.map(c => c.id),
            sport: parseInt(sport)
        })
    }

    const pad = n => String(n).padStart(2, '0')

    return (
        <>
            <h3 className="fw-bold mt-4 mb-4">Novi termin</h3>
            <Form onSubmit={odradiSubmit}>
                <Row className="g-3">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="datum">
                            <Form.Label className="fw-semibold">Datum</Form.Label>
                            <Form.Control
                                type="date"
                                value={odabraniDatum}
                                onChange={e => { setOdabraniDatum(e.target.value); setOdabraniSati([]) }}
                                ref={refDatum}
                                onClick={() => refDatum.current?.showPicker()}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="sport" className="mb-3">
                            <Form.Label>Sport</Form.Label>
                            <Form.Select
                                name="sport"
                                required
                                value={odabraniSport}
                                onChange={e => { setOdabraniSport(e.target.value); setOdabraniSati([]) }}
                            >
                                <option value="">Odaberite sport</option>
                                {sportovi && sportovi.map((sport) => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.naziv}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group>
                            <Form.Label className="fw-semibold d-flex align-items-center gap-2 flex-wrap">
                                Termini
                                {odabraniSati.length > 0 && (
                                    <span className="text-success fw-normal small">
                                        {`${pad(Math.min(...odabraniSati))}:00 – ${pad(Math.max(...odabraniSati) + 1)}:00 · ${odabraniSati.length} ${satGramatika(odabraniSati.length)}`}
                                    </span>
                                )}
                                {zauzetiSati.length > 0 && (
                                    <span className="text-danger fw-normal small">· {zauzetiSati.length} zauzeto</span>
                                )}
                            </Form.Label>
                            {(!odabraniDatum || !odabraniSport) ? (
                                <p className="text-muted small mb-0">Odaberite datum i sport za prikaz termina.</p>
                            ) : ucitavamTermine ? (
                                <p className="text-muted small mb-0">Učitavanje termina...</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                                    {SATI.map(sat => {
                                        const jeOdabran = odabraniSati.includes(sat)
                                        const jeZauzet = zauzetiSati.includes(sat)
                                        return (
                                            <button
                                                key={sat}
                                                type="button"
                                                onClick={() => !jeZauzet && toggleSat(sat)}
                                                style={{
                                                    padding: '8px 4px',
                                                    borderRadius: '8px',
                                                    border: jeZauzet ? '1.5px solid #dc3545' : jeOdabran ? '2px solid #16a34a' : '1.5px solid #dee2e6',
                                                    background: jeZauzet ? '#fff5f5' : jeOdabran ? 'linear-gradient(135deg,#16a34a,#15803d)' : '#fff',
                                                    color: jeZauzet ? '#dc3545' : jeOdabran ? '#fff' : '#495057',
                                                    fontWeight: jeOdabran ? 600 : 400,
                                                    fontSize: '0.85rem',
                                                    cursor: jeZauzet ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    boxShadow: jeOdabran ? '0 2px 8px rgba(22,163,74,0.30)' : 'none',
                                                    opacity: jeZauzet ? 0.8 : 1,
                                                }}
                                            >
                                                <div>{`${pad(sat)}:00 – ${pad(sat + 1)}:00`}</div>
                                                {jeZauzet && <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>Zauzeto</div>}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </Form.Group>
                    </Col>
                    {odabraniSati.length > 0 && odabraniSport && (
                        <Col xs={12}>
                            <div className="d-flex align-items-center gap-2 p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25">
                                <FaEuroSign color="#16a34a" />
                                <span className="fw-semibold text-success">
                                    Ukupna cijena: {odabraniSati.length * (sportovi.find(s => s.id === parseInt(odabraniSport))?.cijenaTermina ?? 0)} €
                                </span>
                                <span className="text-muted small ms-1">
                                    ({odabraniSati.length} × {sportovi.find(s => s.id === parseInt(odabraniSport))?.cijenaTermina ?? 0} €/h)
                                </span>
                            </div>
                        </Col>
                    )}
                    <Col xs={12}>
                        <Form.Group controlId="rezervirao">
                            <Form.Label className="fw-semibold">Član koji rezervira</Form.Label>

                            {odabraniClan ? (
                                <div>
                                    <Badge
                                        bg="success"
                                        className="d-inline-flex align-items-center gap-2 px-3 py-2 fs-6"
                                    >
                                        {odabraniClan.ime} {odabraniClan.prezime}
                                        <FaTimes
                                            role="button"
                                            onClick={() => setOdabraniClan(null)}
                                        />
                                    </Badge>
                                </div>
                            ) : (
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        placeholder="Pretraži po imenu ili prezimenu..."
                                        value={pretraga}
                                        onChange={e => { setPretraga(e.target.value); setPrikaziDropdown(true) }}
                                        onFocus={() => setPrikaziDropdown(true)}
                                        onBlur={() => setTimeout(() => setPrikaziDropdown(false), 150)}
                                        autoComplete="off"
                                    />
                                    {prikaziDropdown && pretraga.length > 0 && (
                                        <ListGroup className="position-absolute w-100 shadow z-3 mt-1">
                                            {filtriraneClanovi.length > 0
                                                ? filtriraneClanovi.map(c => (
                                                    <ListGroup.Item
                                                        action
                                                        key={c.id}
                                                        onMouseDown={() => {
                                                            setOdabraniClan(c)
                                                            setPretraga('')
                                                            setPrikaziDropdown(false)
                                                        }}
                                                    >
                                                        <span className="fw-semibold">{c.ime} {c.prezime}</span>
                                                    </ListGroup.Item>
                                                ))
                                                : <ListGroup.Item className="text-muted">Nema rezultata</ListGroup.Item>
                                            }
                                        </ListGroup>
                                    )}
                                </div>
                            )}
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="sudionici">
                            <Form.Label className="fw-semibold">Sudionici</Form.Label>

                            {odabraniSudionici.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    {odabraniSudionici.map(c => (
                                        <Badge
                                            key={c.id}
                                            bg="primary"
                                            className="d-inline-flex align-items-center gap-2 px-3 py-2 fs-6"
                                        >
                                            {c.ime} {c.prezime}
                                            <FaTimes role="button" onClick={() => ukloniSudionika(c.id)} />
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="position-relative">
                                <Form.Control
                                    type="text"
                                    placeholder="Pretraži po imenu ili prezimenu..."
                                    value={pretragaSudionika}
                                    onChange={e => { setPretragaSudionika(e.target.value); setPrikaziDropdownSudionici(true) }}
                                    onFocus={() => setPrikaziDropdownSudionici(true)}
                                    onBlur={() => setTimeout(() => setPrikaziDropdownSudionici(false), 150)}
                                    autoComplete="off"
                                />
                                {prikaziDropdownSudionici && pretragaSudionika.length > 0 && (
                                    <ListGroup className="position-absolute w-100 shadow z-3 mt-1">
                                        {filtriraneSudionici.length > 0
                                            ? filtriraneSudionici.map(c => (
                                                <ListGroup.Item
                                                    action
                                                    key={c.id}
                                                    onMouseDown={() => dodajSudionika(c)}
                                                >
                                                    <span className="fw-semibold">{c.ime} {c.prezime}</span>
                                                </ListGroup.Item>
                                            ))
                                            : <ListGroup.Item className="text-muted">Nema rezultata</ListGroup.Item>
                                        }
                                    </ListGroup>
                                )}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <hr style={{ marginTop: '20px', border: '0' }} />

                <Row>
                    <Col>
                        <Link to={RouteNames.TERMINI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col className="text-end">
                        <Button type="submit" variant="success">
                            Dodaj novi termin
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
