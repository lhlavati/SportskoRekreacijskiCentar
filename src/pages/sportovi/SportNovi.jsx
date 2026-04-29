import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import SportService from "../../services/sportovi/SportService";
import { useEffect, useState } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { useForm } from "react-hook-form";

export default function SportNovi() {
  const navigate = useNavigate();
  const [kategorije, setKategorije] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    ucitajKategorije();
  }, []);

  async function ucitajKategorije() {
    await KategorijaService.get().then((odgovor) => {
      if (!odgovor.success) {
        alert('Nije implementiran servis');
        return;
      }
      setKategorije(odgovor.data);
    });
  }

  async function dodaj(sport) {
    await SportService.dodaj(sport).then(() => {
      navigate(RouteNames.SPORTOVI);
    });
  }

  function odradiSubmit(data) {
    dodaj({
      naziv: data.naziv.trim(),
      kategorija: parseInt(data.kategorija),
      kontaktni: data.kontaktni ?? false,
      maxIgraca: data.maxIgraca,
      uZatvorenom: data.uZatvorenom ?? false,
      trajanjeMin: data.trajanjeMin,
      cijenaTermina: data.cijenaTermina,
      pdf: data.pdf || undefined,
    });
  }

  return (
    <>
      <h3>Unos novog sporta</h3>
      <Form onSubmit={handleSubmit(odradiSubmit)}>
        <Form.Group controlId="naziv" className="mb-3">
          <Form.Label>Naziv</Form.Label>
          <Form.Control
            type="text"
            isInvalid={!!errors.naziv}
            {...register('naziv', {
              required: 'Naziv je obavezan!',
              validate: v => v.trim().length >= 3 || 'Naziv sporta mora imati najmanje 3 znaka!'
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.naziv?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="kategorija" className="mb-3">
          <Form.Label>Kategorija</Form.Label>
          <Form.Select
            isInvalid={!!errors.kategorija}
            {...register('kategorija', {
              required: 'Morate odabrati kategoriju!',
              validate: v => (v && parseInt(v) > 0) || 'Odabrana kategorija nije valjana!'
            })}
          >
            <option value="">Odaberite kategoriju</option>
            {kategorije.map((kat) => (
              <option key={kat.id} value={kat.id}>{kat.naziv}</option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.kategorija?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="maxIgraca" className="mb-3">
          <Form.Label>Max Igrača</Form.Label>
          <Form.Control
            type="number"
            step={1}
            isInvalid={!!errors.maxIgraca}
            {...register('maxIgraca', {
              required: 'Broj igrača je obavezan!',
              valueAsNumber: true,
              min: { value: 1, message: 'Broj igrača ne može biti manji od 1!' },
              max: { value: 30, message: 'Broj igrača ne može biti veći od 30!' }
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.maxIgraca?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="trajanjeMin" className="mb-3">
          <Form.Label>Trajanje (min)</Form.Label>
          <Form.Control
            type="number"
            step={1}
            isInvalid={!!errors.trajanjeMin}
            {...register('trajanjeMin', {
              required: 'Trajanje je obavezno!',
              valueAsNumber: true,
              min: { value: 1, message: 'Trajanje mora biti najmanje 1 minuta!' },
              max: { value: 500, message: 'Trajanje ne može biti veće od 500 minuta!' }
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.trajanjeMin?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="cijenaTermina" className="mb-3">
          <Form.Label>Cijena termina (€)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            isInvalid={!!errors.cijenaTermina}
            {...register('cijenaTermina', {
              required: 'Cijena je obavezna!',
              valueAsNumber: true,
              min: { value: 0, message: 'Cijena mora biti broj veći ili jednak 0!' }
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cijenaTermina?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-switch mt-2 px-4 mb-2">
          <Form.Check label="U zatvorenom" {...register('uZatvorenom')} />
        </Form.Group>

        <Form.Group className="form-switch mt-2 px-4 mb-3">
          <Form.Check label="Kontaktni" {...register('kontaktni')} />
        </Form.Group>

        <Form.Group controlId="pdf" className="mb-3">
          <Form.Label>PDF Generator (npr. nogomet.jsx)</Form.Label>
          <Form.Control
            type="text"
            placeholder="ime-datoteke.jsx"
            {...register('pdf')}
          />
        </Form.Group>

        <hr style={{ marginTop: "20px", border: "0" }} />

        <div className="d-grid gap-2 d-sm-flex justify-content-sm-between mt-3">
          <Link to={RouteNames.SPORTOVI} className="btn btn-danger">
            Odustani
          </Link>
          <Button type="submit" variant="success">
            Dodaj novi sport
          </Button>
        </div>
      </Form>
    </>
  );
}
