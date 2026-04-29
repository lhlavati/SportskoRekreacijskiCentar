import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { useForm } from "react-hook-form";

export default function KategorijaPromjena() {
  const navigate = useNavigate();
  const params = useParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    ucitajKategoriju();
  }, []);

  async function ucitajKategoriju() {
    await KategorijaService.getById(params.id).then((odgovor) => {
      if (!odgovor.success) {
        alert('Nije implementiran servis');
        return;
      }
      reset({ naziv: odgovor.data.naziv });
    });
  }

  async function promjeni(kategorija) {
    await KategorijaService.promjeni(params.id, kategorija).then(() => {
      navigate(RouteNames.KATEGORIJE);
    });
  }

  function odradiSubmit(data) {
    promjeni({ naziv: data.naziv.trim() });
  }

  return (
    <>
      <h3>Promjena kategorije</h3>
      <Form onSubmit={handleSubmit(odradiSubmit)}>
        <Container className="mt-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Podaci o kategoriji</Card.Title>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label className="fw-bold">Naziv</Form.Label>
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
                <Link to={RouteNames.KATEGORIJE} className="btn btn-danger px-4">
                  Odustani
                </Link>
                <Button type="submit" variant="success">
                  Promjeni kategoriju
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </Form>
    </>
  );
}
