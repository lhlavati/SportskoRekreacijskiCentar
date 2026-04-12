import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { IME_APLIKACIJE, RouteNames } from "../constants";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'


export default function Izbornik() {

    const navigate = useNavigate()


    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                        onClick={()=>navigate(RouteNames.HOME)}
                        >Početna</Nav.Link>
                        <Nav.Link
                        onClick={()=>navigate(RouteNames.SPORTOVI)}
                        >Sportovi</Nav.Link>
                        <Nav.Link
                        onClick={()=>navigate(RouteNames.CLANOVI)}
                        >Članovi</Nav.Link>
                        <Nav.Link
                        onClick={()=>navigate(RouteNames.KATEGORIJE)}
                        >Kategorije</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}