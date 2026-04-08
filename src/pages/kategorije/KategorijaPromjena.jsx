import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import SportService from "../../services/sportovi/SportService";
import { useEffect, useState } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService";

export default function KategorijaPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [kategorija, setKategorija] = useState([])
    const [sportovi, setSportovi] = useState([])

    useEffect(() => {
        ucitajSportove()
        ucitajKategorije()
    }, [])

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setKategorija(odgovor.data)
        })
    }

    async function ucitajSportove() {
        await SportService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setSportovi(odgovor.data)
        })
    }

    async function promjeni(kategorija) {
        await KategorijaService.promjeni(params.id, kategorija).then(() => {
            navigate(RouteNames.KATEGORIJE)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);
        promjeni({
            vrsta: podaci.get("vrsta"),
            sport: podaci.get("sport")
        });
    }

    return (
        <>
            <h3>Promjena kategorije</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o kategoriji</Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="vrsta" className="mb-3">
                                        <Form.Label className="fw-bold">Vrsta</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="vrsta"
                                            placeholder="Unesite vrstu kategorije"
                                            required
                                            defaultValue={kategorija.vrsta}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="sport" className="mb-3">
                                        <Form.Label className="fw-bold">Sport</Form.Label>
                                        <Form.Select name="sport" required value={kategorija.sport || ''} onChange={(e) => setKategorija({ ...kategorija, sport: parseInt(e.target.value) })}>
                                            <option value="">Odaberite sport</option>
                                            {sportovi && sportovi.map((sport) => (
                                                <option key={sport.sifra} value={sport.sifra}>
                                                    {sport.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.GRUPE} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Promjeni grupu
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}