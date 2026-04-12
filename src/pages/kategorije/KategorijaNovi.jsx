import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { useEffect, useState } from "react";

export default function KategorijaNovi() {
  const navigate = useNavigate();
  const [kategorija, setKategorija] = useState([])

  useEffect(() => {
    ucitajKategorije()
  })

  async function ucitajKategorije() {
    await KategorijaService.get().then((odgovor) => {
      if (!odgovor.success) {
        alert('Nije implementiran servis')
        return
      }
      setKategorija(odgovor.data)
    })
  }

  async function dodaj(kategorija) {
    await KategorijaService.dodaj(kategorija).then(() => {
      navigate(RouteNames.KATEGORIJE);
    });
  }

  function odradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);

    if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
      alert("Naziv je obavezan i ne smije sadržavati samo razmake!")
      return
    }

    if (podaci.get('naziv').trim().length < 3) {
        alert("Naziv kategorije mora imati najmanje 3 znaka!")
        return
    }

    dodaj({
      naziv: podaci.get("naziv")
    });
  }

  return (
    <>
      <h3>Unos nove kategorije</h3>
      <Form onSubmit={odradiSubmit}>
        <Container className="mt-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Podaci o kategoriji</Card.Title>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label className="fw-bold">Naziv kategorije</Form.Label>
                    <Form.Control
                      type="text"
                      name="naziv"
                      placeholder="Unesite naziv kategorije"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <Link to={RouteNames.GRUPE} className="btn btn-danger px-4">
                  Odustani
                </Link>
                <Button type="submit" variant="success">
                  Dodaj novu kategoriju
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </Form>
    </>
  )
}
