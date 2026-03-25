import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import SportService from "../../services/sportovi/SportService";

export default function SportNovi() {
  const navigate = useNavigate();

  async function dodaj(sport) {
    await SportService.dodaj(sport).then(() => {
      navigate(RouteNames.SPORTOVI);
    });
  }

  function odradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    dodaj({
      naziv: podaci.get("naziv"),
      kategorija: podaci.get("kategorija"),
      kontaktni: podaci.get("kontaktni"),
      maxIgraca: parseInt(podaci.get("maxIgraca")),
      uZatvorenom: podaci.get("uZatvorenom"),
      trajanjeMin: parseInt(podaci.get("trajanjeMin")),
    });
  }

  return (
    <>
      <h3>Unos novog sporta</h3>
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="naziv">
          <Form.Label>Naziv</Form.Label>
          <Form.Control type="text" name="naziv" required />
        </Form.Group>
        <Form.Group controlId="kategorija">
          <Form.Label>Kategorija</Form.Label>
          <Form.Select name="kategorija" aria-label="Kategorija">
            <option disabled></option>
            <option value="Ekipni">Ekipni</option>
            <option value="Individualni">Individualni</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="maxIgraca">
          <Form.Label>Max Igrača</Form.Label>
          <Form.Control type="number" name="maxIgraca" step={1} />
        </Form.Group>
        <Form.Group controlId="trajanjeMin">
          <Form.Label>Trajanje (min)</Form.Label>
          <Form.Control type="number" name="trajanjeMin" step={1} />
        </Form.Group>
        <Form.Group controlId="uZatvorenom">
          <Form.Check label="U zatvorenom" name="uZatvorenom" />
        </Form.Group>
        <Form.Group controlId="kontaktni">
          <Form.Check label="Kontaktni" name="kontaktni" />
        </Form.Group>

        <hr style={{ marginTop: "20px", border: "0" }} />

        <Row>
          <Col>
            <Link to={RouteNames.SPORTOVI} className="btn btn-danger">
              Odustani
            </Link>
          </Col>
          <Col>
            <Button type="sumbit" variant="success">
              Dodaj novi sport
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
