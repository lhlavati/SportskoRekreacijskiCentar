import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { RouteNames } from "../constants";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logogemini.png'


export default function Izbornik() {

    const navigate = useNavigate()


    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>
                    <Nav.Link
                    onClick={()=>navigate(RouteNames.HOME)}
                    ><Image src={logo} fluid /></Nav.Link>
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