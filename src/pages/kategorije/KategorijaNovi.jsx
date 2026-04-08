import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { useEffect, useState } from "react";
import SportService from "../../services/sportovi/SportService";

export default function KategorijaNovi() {
  const navigate = useNavigate();
  const [sportovi, setSportovi] = useState([])

  useEffect(() => {
    ucitajSportove()
  })

  async function ucitajSportove() {
    await SportService.get().then((odgovor) => {
      if (!odgovor.success) {
        alert('Nije implementiran servis')
        return
      }
      setSportovi(odgovor.data)
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
    dodaj({
      vrsta: podaci.get("vrsta"),
      sport: podaci.get("sport")
    });
  }

  return (
    <>
      <h3>Unos nove grupe</h3>
      <Form onSubmit={odradiSubmit}>
        <Container className="mt-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Podaci o kategoriji</Card.Title>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="vrsta" className="mb-3">
                    <Form.Label className="fw-bold">Vrsta kategorije</Form.Label>
                    <Form.Control
                      type="text"
                      name="vrsta"
                      placeholder="Unesite vrstu kategorije"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="sport" className="mb-3">
                    <Form.Label className="fw-bold">Sport</Form.Label>
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

              <hr />

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
