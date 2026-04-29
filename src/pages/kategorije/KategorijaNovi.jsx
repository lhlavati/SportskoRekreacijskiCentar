import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { useForm } from "react-hook-form";

export default function KategorijaNovi() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function dodaj(kategorija) {
    await KategorijaService.dodaj(kategorija).then(() => {
      navigate(RouteNames.KATEGORIJE);
    });
  }

  function odradiSubmit(data) {
    dodaj({ naziv: data.naziv.trim() });
  }

  return (
    <>
      <h3>Unos nove kategorije</h3>
      <Form onSubmit={handleSubmit(odradiSubmit)}>
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
                      placeholder="Unesite naziv kategorije"
                      isInvalid={!!errors.naziv}
                      {...register('naziv', {
                        required: 'Naziv je obavezan!',
                        validate: v => v.trim().length >= 3 || 'Naziv kategorije mora imati najmanje 3 znaka!'
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.naziv?.message}
                    </Form.Control.Feedback>
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
  );
}
