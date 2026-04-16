import { useEffect, useRef, useState } from "react"
import { Badge, Button, Col, Form, ListGroup, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import TerminService from "../../services/termini/TerminService"
import ClanService from "../../services/clanovi/ClanService"
import SportService from "../../services/sportovi/SportService"
import { FaTimes } from "react-icons/fa"

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

    const refDatumPocetka = useRef(null)
    const refDatumKraja = useRef(null)

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

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        const datumPocetka = podaci.get('datumPocetka')
        const datumKraja   = podaci.get('datumKraja')
        const cijena       = podaci.get('cijena')
        const sport        = podaci.get('sport')

        if (!datumPocetka) {
            alert("Datum početka je obavezan!")
            return
        }
        if (!datumKraja) {
            alert("Datum kraja je obavezan!")
            return
        }
        if (new Date(datumKraja) <= new Date(datumPocetka)) {
            alert("Datum kraja mora biti nakon datuma početka!")
            return
        }
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

        promjeni({
            datumPocetka: datumPocetka,
            datumKraja:   datumKraja,
            cijena:       parseFloat(cijena),
            rezervirao:   odabraniClan.id,
            sudionici:    odabraniSudionici.map(c => c.id),
            sport:        parseInt(sport),
        })
    }

    const formatZaInput = (iso) => iso ? iso.slice(0, 16) : ''

    return (
        <>
            <h3 className="fw-bold mt-4 mb-4">Promjena termina</h3>
            <Form onSubmit={odradiSubmit}>
                <Row className="g-3">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="datumPocetka">
                            <Form.Label className="fw-semibold">Datum i vrijeme početka</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="datumPocetka"
                                required
                                defaultValue={formatZaInput(termin.datumPocetka)}
                                key={termin.datumPocetka}
                                ref={refDatumPocetka}
                                onFocus={() => refDatumPocetka.current?.showPicker()}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="datumKraja">
                            <Form.Label className="fw-semibold">Datum i vrijeme kraja</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="datumKraja"
                                required
                                defaultValue={formatZaInput(termin.datumKraja)}
                                key={termin.datumKraja}
                                ref={refDatumKraja}
                                onFocus={() => refDatumKraja.current?.showPicker()}
                            />
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
                        <Form.Group controlId="sport" className="mb-3">
                            <Form.Label>Sport</Form.Label>
                            <Form.Select
                                name="sport"
                                required
                                defaultValue={termin.sport}
                                key={termin.sport}
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
