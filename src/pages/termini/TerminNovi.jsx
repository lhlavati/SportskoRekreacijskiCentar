import { Button, Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import TerminService from "../../services/termini/TerminService"
import { useEffect, useState } from "react"
import SportService from "../../services/sportovi/SportService"

export default function TerminNovi() {

    const [sportovi, setSportovi] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        ucitajSportove()
    }, [])

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

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        const datumPocetka = podaci.get('datumPocetka')
        const datumKraja   = podaci.get('datumKraja')
        const cijena       = podaci.get('cijena')
        const rezervirao   = podaci.get('rezervirao')
        const sudionici    = podaci.get('sudionici')?.trim()
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
        if (!rezervirao || isNaN(parseInt(rezervirao)) || parseInt(rezervirao) <= 0) {
            alert("ID člana koji rezervira je obavezan!")
            return
        }
        if (!sudionici) {
            alert("Sudionici su obavezni (unesite barem jedan ID)!")
            return
        }
        if (!sport) {
            alert("Niste odabrali važeći sport!")
            return
        }

        const sudionici_niz = sudionici
            .split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n))

        if (sudionici_niz.length === 0) {
            alert("Niste unijeli valjane ID-ove sudionika!")
            return
        }

        dodaj({
            datumPocetka: datumPocetka,
            datumKraja:   datumKraja,
            cijena:       parseFloat(cijena),
            rezervirao:   parseInt(rezervirao),
            sudionici:    sudionici_niz,
            sport:        parseInt(sport)
        })
    }

    return (
        <>
            <h3 className="fw-bold mt-4 mb-4">Novi termin</h3>
            <Form onSubmit={odradiSubmit}>
                <Row className="g-3">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="datumPocetka">
                            <Form.Label className="fw-semibold">Datum i vrijeme početka</Form.Label>
                            <Form.Control type="datetime-local" name="datumPocetka" required />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="datumKraja">
                            <Form.Label className="fw-semibold">Datum i vrijeme kraja</Form.Label>
                            <Form.Control type="datetime-local" name="datumKraja" required />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="cijena">
                            <Form.Label className="fw-semibold">Cijena (€)</Form.Label>
                            <Form.Control type="number" name="cijena" min="0" step="0.01" required />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="rezervirao">
                            <Form.Label className="fw-semibold">ID člana koji rezervira</Form.Label>
                            <Form.Control type="number" name="rezervirao" min="1" step="1" required />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="sudionici">
                            <Form.Label className="fw-semibold">Sudionici (ID-ovi odvojeni zarezom)</Form.Label>
                            <Form.Control
                                type="text"
                                name="sudionici"
                                placeholder="npr. 1, 2, 5, 8"
                                required
                            />
                            <Form.Text className="text-muted">
                                Unesite ID-ove članova odvojene zarezom, npr. "1, 2, 5, 8"
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="sport" className="mb-3">
                            <Form.Label>Sport</Form.Label>
                            <Form.Select name="sport" required>
                                <option value="">Odaberite sport</option>
                                {sportovi && sportovi.map((sport) => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.naziv}
                                    </option>
                                ))}
                            </Form.Select>
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
