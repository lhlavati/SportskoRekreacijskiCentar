import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { useNavigate } from "react-router-dom"
import { ShemaLogin } from "../../schemas/ShemaOperater"
import { useState } from "react"
import useAuth from "../../hooks/useAuth"

export default function Login() {

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    const { login } = useAuth();

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({})

        const rezultat = ShemaLogin.safeParse({
            email: podaci.get('email'),
            lozinka: podaci.get('lozinka')
        })

        if (!rezultat.success) {
            setErrors({ email: 'Kombinacija email i lozinka ne odgovaraju' })
            return
        }

        login(podaci.get('email'), podaci.get('lozinka'))
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
                            <Card.Title className="mb-4">Podaci za prijavu</Card.Title>
                            <p className="text-muted small">
                                admin@src.hr / Src12345!
                            </p>

                            {errors.opce && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.opce}
                                </div>
                            )}

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
                                <Col xs={12}>
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
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate(RouteNames.REGISTRACIJA)}
                                >
                                    Registriraj se
                                </Button>
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="px-4"
                                >
                                    Prijavi se
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
