import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { useNavigate } from "react-router-dom"
import OperaterService from "../../services/operateri/OperaterService"
import { ShemaOperater } from "../../schemas/ShemaOperater"
import { useState } from "react"

export default function Registracija() {

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    async function registriraj(operater) {
        await OperaterService.dodaj(operater).then(() => {
            navigate(RouteNames.LOGIN)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({})
        const objektPodataka = Object.fromEntries(podaci)

        if (podaci.get('lozinka') !== podaci.get('potvrdaLozinke')) {
            setErrors({ potvrdaLozinke: "Lozinke se ne podudaraju!" })
            return
        }

        const rezultat = ShemaOperater.safeParse({
            email: objektPodataka.email,
            lozinka: objektPodataka.lozinka,
            uloga: 'korisnik'
        })

        if (!rezultat.success) {
            const noveGreske = {}
            rezultat.error.issues.forEach((issue) => {
                const kljuc = issue.path[0]
                if (!noveGreske[kljuc]) {
                    noveGreske[kljuc] = issue.message
                }
            })
            setErrors(noveGreske)
            return
        }

        registriraj({
            email: podaci.get('email'),
            lozinka: podaci.get('lozinka'),
            uloga: 'korisnik'
        })
    }

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors }
            delete noveGreske[nazivPolja]
            setErrors(noveGreske)
        }
    }

    return (
        <>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci za registraciju</Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label className="fw-bold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="vas@email.hr"
                                            isInvalid={!!errors.email}
                                            onFocus={() => ocistiGresku('email')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="lozinka" className="mb-3">
                                        <Form.Label className="fw-bold">Lozinka</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="lozinka"
                                            placeholder="Unesite lozinku"
                                            isInvalid={!!errors.lozinka}
                                            onFocus={() => ocistiGresku('lozinka')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lozinka}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="potvrdaLozinke" className="mb-3">
                                        <Form.Label className="fw-bold">Potvrdi lozinku</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="potvrdaLozinke"
                                            placeholder="Ponovite lozinku"
                                            isInvalid={!!errors.potvrdaLozinke}
                                            onFocus={() => ocistiGresku('potvrdaLozinke')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.potvrdaLozinke}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate(RouteNames.LOGIN)}
                                >
                                    Već imam račun
                                </Button>
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="px-4"
                                >
                                    Registriraj se
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
