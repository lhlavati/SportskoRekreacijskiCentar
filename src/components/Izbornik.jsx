import { Container, Image, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { RouteNames } from "../constants";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logogemini.png'
import useAuth from "../hooks/useAuth";


export default function Izbornik() {

    const navigate = useNavigate()
    const { isLoggedIn, logout, authUser } = useAuth()

    return (
        <Navbar expand="lg" className="src-navbar">
            <Container>
                <Navbar.Brand>
                    <Nav.Link
                        onClick={() => navigate(RouteNames.HOME)}
                    ><Image src={logo} fluid /></Nav.Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => navigate(RouteNames.HOME)}
                        >Početna</Nav.Link>

                        {isLoggedIn && (
                            <>
                                <Nav.Link
                                    onClick={() => navigate(RouteNames.SPORTOVI)}
                                >Sportovi</Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate(RouteNames.CLANOVI)}
                                >Članovi</Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate(RouteNames.KATEGORIJE)}
                                >Kategorije</Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate(RouteNames.TERMINI)}
                                >Termini</Nav.Link>

                                {authUser.uloga === 'admin' && (
                                    <>
                                        <Nav.Link
                                            onClick={() => navigate(RouteNames.OPERATERI)}
                                        >Operateri</Nav.Link>
                                        <Nav.Link
                                            onClick={() => navigate(RouteNames.NADZORNA_PLOCA)}
                                        >Nadzorna ploča</Nav.Link>
                                        <Nav.Link
                                            className="nav-generiraj"
                                            onClick={() => navigate(RouteNames.GENERIRAJ_PODATKE)}
                                        >Generiraj podatke</Nav.Link>
                                    </>
                                )}
                            </>
                        )}
                    </Nav>

                    <Nav>
                        {isLoggedIn ? (
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className=""
                                onClick={() => logout()}
                            >
                                Odjava ({authUser.email})
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => navigate(RouteNames.REGISTRACIJA)}
                                >Registracija</Button>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => navigate(RouteNames.LOGIN)}
                                >Login</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
