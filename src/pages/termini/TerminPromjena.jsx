import { useEffect, useRef, useState } from "react"
import { Badge, Button, Col, Form, ListGroup, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import TerminService from "../../services/termini/TerminService"
import ClanService from "../../services/clanovi/ClanService"
import SportService from "../../services/sportovi/SportService"
import { FaTimes } from "react-icons/fa"

const SATI = Array.from({ length: 14 }, (_, i) => i + 8)

function satGramatika(n) {
    if (n === 1) return 'sat'
    if (n >= 2 && n <= 4) return 'sata'
    return 'sati'
}

export default function TerminPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [termin, setTermin] = useState({})
    const [clanovi, setClanovi] = useState([])
    const [sportovi, setSportovi] = useState([])

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

    useEffect(() => {
        ucitajTermin()
        ucitajClanove()
        ucitajSportove()
    }, [])

    useEffect(() => {
        if (!termin.id || clanovi.length === 0) return
        const clan = clanovi.find(c => c.id === termin.rezervirao)
        if (clan) setOdabraniClan(clan)
        const sudionici = clanovi.filter(c => termin.sudionici?.includes(c.id))
        setOdabraniSudionici(sudionici)
    }, [termin.id, clanovi.length])

    useEffect(() => {
        if (termin.sport) setOdabraniSport(String(termin.sport))
    }, [termin.sport])

    useEffect(() => {
        if (!odabraniDatum || !odabraniSport) {
            setZauzetiSati([])
            return
        }
        ucitajZauzeteSate()
    }, [odabraniDatum, odabraniSport])

    useEffect(() => {
        if (!termin.datumPocetka || !termin.datumKraja) return
        const pocetak = new Date(termin.datumPocetka)
        const pad = n => String(n).padStart(2, '0')
        setOdabraniDatum(`${pocetak.getFullYear()}-${pad(pocetak.getMonth() + 1)}-${pad(pocetak.getDate())}`)
        if (termin.odabraniSati && termin.odabraniSati.length > 0) {
            setOdabraniSati(termin.odabraniSati)
        } else {
            const kraj = new Date(termin.datumKraja)
            const pocetakSat = pocetak.getHours()
            const krajSat = kraj.getHours()
            setOdabraniSati(Array.from({ length: krajSat - pocetakSat }, (_, i) => pocetakSat + i))
        }
    }, [termin.datumPocetka, termin.datumKraja])

    async function ucitajZauzeteSate() {
        setUcitavamTermine(true)
        const odgovor = await TerminService.get()
        setUcitavamTermine(false)
        if (!odgovor.success) return
        const sati = []
        odgovor.data
            .filter(t => t.datumPocetka?.slice(0, 10) === odabraniDatum && t.sport === parseInt(odabraniSport) && t.id !== parseInt(params.id))
            .forEach(t => {
                if (t.odabraniSati?.length > 0) {
                    sati.push(...t.odabraniSati)
                } else if (t.datumPocetka && t.datumKraja) {
                    const poc = new Date(t.datumPocetka).getHours()
                    const kraj = new Date(t.datumKraja).getHours()
                    for (let h = poc; h < kraj; h++) sati.push(h)
                }
            })
        setZauzetiSati([...new Set(sati)])
    }

    async function ucitajTermin() {
        await TerminService.getById(params.id).then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setTermin(odgovor.data)
        })
    }

    async function ucitajClanove() {
        await ClanService.get().then((odgovor) => {
            if (odgovor.success) setClanovi(odgovor.data)
        })
    }

    async function ucitajSportove() {
        await SportService.get().then((odgovor) => {
            if (odgovor.success) setSportovi(odgovor.data)
        })
    }

    async function promjeni(noviTermin) {
        await TerminService.promjeni(params.id, noviTermin).then(() => {
            navigate(RouteNames.TERMINI)
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
        const cijena = podaci.get('cijena')
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
        const sortirani = [...odabraniSati].sort((a, b) => a - b)
        if (cijena === '' || isNaN(Number(cijena)) || Number(cijena) < 0) {
            alert("Cijena mora biti broj veći ili jednak 0!")
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

        const pad = n => String(n).padStart(2, '0')
        const datumPocetka = `${odabraniDatum}T${pad(sortirani[0])}:00`
        const datumKraja = `${odabraniDatum}T${pad(sortirani[sortirani.length - 1] + 1)}:00`

        promjeni({
            datumPocetka,
            datumKraja,
            odabraniSati: sortirani,
            cijena: parseFloat(cijena),
            rezervirao: odabraniClan.id,
            sudionici: odabraniSudionici.map(c => c.id),
            sport: parseInt(sport),
        })
    }

    const pad = n => String(n).padStart(2, '0')

    return (
        <>
            <h3 className="fw-bold mt-4 mb-4">Promjena termina</h3>
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
                    <Col xs={12} md={6}>
                        <Form.Group controlId="cijena">
                            <Form.Label className="fw-semibold">Cijena (€)</Form.Label>
                            <Form.Control
                                type="number"
                                name="cijena"
                                min="0"
                                step="0.01"
                                required
                                defaultValue={termin.cijena}
                                key={termin.cijena}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
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
                            Spremi promjene
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
