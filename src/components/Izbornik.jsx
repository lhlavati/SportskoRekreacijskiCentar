import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { IME_APLIKACIJE, RouteNames } from "../constants";
import { useNavigate } from "react-router-dom";


export default function Izbornik() {

    const navigate = useNavigate()


    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand>{IME_APLIKACIJE}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                        onClick={()=>navigate(RouteNames.HOME)}
                        >Početna</Nav.Link>
                        
                        <NavDropdown title="Sportovi" id="basic-nav-dropdown">
                            <NavDropdown.Item
                            onClick={()=>navigate(RouteNames.SPORTOVI)}
                            >Sportovi</NavDropdown.Item>
                            
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}