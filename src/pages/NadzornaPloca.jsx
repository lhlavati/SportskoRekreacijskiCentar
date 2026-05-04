import { Card, Container } from "react-bootstrap"
import useAuth from "../hooks/useAuth"

export default function NadzornaPloca() {
    const { authUser } = useAuth()

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title>Dobrodošli!</Card.Title>
                    <p className="text-muted">
                        Prijavljeni ste kao <strong>{authUser.email}</strong>
                        {' '}
                        <span className={`badge ${authUser.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {authUser.uloga}
                        </span>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    )
}
