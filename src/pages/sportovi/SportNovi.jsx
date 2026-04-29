import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import SportService from "../../services/sportovi/SportService";
import { useEffect, useState } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService";

export default function SportNovi() {
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

  async function dodaj(sport) {
    await SportService.dodaj(sport).then(() => {
      navigate(RouteNames.SPORTOVI);
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
        alert("Naziv sporta mora imati najmanje 3 znaka!")
        return
    }

    if (!podaci.get('kategorija') || podaci.get('kategorija') === "") {
        alert("Morate odabrati kategoriju!");
        return;
    }

    const odabranaKategorija = parseInt(podaci.get('kategorija'));
    if (isNaN(odabranaKategorija) || odabranaKategorija <= 0) {
        alert("Odabrana kategorija nije valjanja!");
        return;
    }

    if (isNaN(podaci.get('maxIgraca')) || podaci.get('maxIgraca') < 1 || podaci.get('maxIgraca') > 30) {
        alert("Broj igrača ne može biti manji od 1 i veći od 30!")
        return
    }

    if (isNaN(podaci.get('trajanjeMin')) || podaci.get('trajanjeMin') < 1 || podaci.get('trajanjeMin') > 500) {
        alert("Trajanje mora biti broj između 1 i 500")
        return
    }

    if (isNaN(podaci.get('cijenaTermina')) || Number(podaci.get('cijenaTermina')) < 0) {
        alert("Cijena termina mora biti broj veći ili jednak 0!")
        return
    }

    dodaj({
      naziv: podaci.get("naziv"),
      kategorija: odabranaKategorija,
      kontaktni: podaci.get("kontaktni"),
      maxIgraca: parseInt(podaci.get("maxIgraca")),
      uZatvorenom: podaci.get("uZatvorenom"),
      trajanjeMin: parseInt(podaci.get("trajanjeMin")),
      cijenaTermina: parseFloat(podaci.get("cijenaTermina")),
      pdf: podaci.get("pdf") || undefined,
    });
  }

  return (
    <>
      <h3>Unos novog sporta</h3>
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="naziv" className="mb-3">
          <Form.Label>Naziv</Form.Label>
          <Form.Control type="text" name="naziv" required />
        </Form.Group>
        <Form.Group controlId="kategorija" className="mb-3">
            <Form.Label>Kategorija</Form.Label>
            <Form.Select name="kategorija" required>
                <option value="">Odaberite kategoriju</option>
                {kategorija && kategorija.map((kategorija) => (
                    <option key={kategorija.id} value={kategorija.id}>
                        {kategorija.naziv}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="maxIgraca" className="mb-3">
          <Form.Label>Max Igrača</Form.Label>
          <Form.Control type="number" name="maxIgraca" step={1} />
        </Form.Group>
        <Form.Group controlId="trajanjeMin" className="mb-3">
          <Form.Label>Trajanje (min)</Form.Label>
          <Form.Control type="number" name="trajanjeMin" step={1} />
        </Form.Group>
        <Form.Group controlId="cijenaTermina" className="mb-3">
          <Form.Label>Cijena termina (€)</Form.Label>
          <Form.Control type="number" name="cijenaTermina" min="0" step="0.01" />
        </Form.Group>
        <Form.Group controlId="uZatvorenom" className="form-switch mt-2 px-4 mb-2">
          <Form.Check label="U zatvorenom" name="uZatvorenom" />
        </Form.Group>
        <Form.Group controlId="kontaktni" className="form-switch mt-2 px-4 mb-3">
          <Form.Check label="Kontaktni" name="kontaktni" />
        </Form.Group>
        <Form.Group controlId="pdf" className="mb-3">
          <Form.Label>PDF Generator (npr. nogomet.jsx)</Form.Label>
          <Form.Control type="text" name="pdf" placeholder="ime-datoteke.jsx" />
        </Form.Group>

        <hr style={{ marginTop: "20px", border: "0" }} />

        <div className="d-grid gap-2 d-sm-flex justify-content-sm-between mt-3">
          <Link to={RouteNames.SPORTOVI} className="btn btn-danger">
            Odustani
          </Link>
          <Button type="sumbit" variant="success">
            Dodaj novi sport
          </Button>
        </div>
      </Form>
    </>
  );
}
