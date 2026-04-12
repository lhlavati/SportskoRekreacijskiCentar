import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import SportService from "../../services/sportovi/SportService";
import { useEffect, useState } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService";

export default function SportPromjena() {

  const navigate = useNavigate()
  const params = useParams()
  const [sport, setSport] = useState({})
  const [kontaktni, setKontaktni] = useState(false)
  const [uZatvorenom, setuZatvorenom] = useState(false)
  const [kategorije, setKategorije] = useState([])

  useEffect(() => {
    ucitajKategorije(),
    ucitajSport()
  }, [])

  async function ucitajKategorije() {
    await KategorijaService.get().then((odgovor) => {
      if (!odgovor.success) {
        alert('Nije implementiran servis')
        return
      }
      setKategorije(odgovor.data)
    })
  }

  async function ucitajSport() {
    await SportService.getById(params.id).then((odgovor) => {

      if (!odgovor.success) {
        alert('Nije implementiran servis')
        return
      }

      const s = odgovor.data

      setSport(s)
      setKontaktni(s.kontaktni)
      setuZatvorenom(s.uZatvorenom)
    })
  }

  async function promjeni(sport) {
    await SportService.promjeni(params.id, sport).then(() => {
      navigate(RouteNames.SPORTOVI)
    })
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
    
    promjeni({
      naziv: podaci.get("naziv"),
      kategorija: parseInt(podaci.get("kategorija")),
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
          <Form.Control type="text" name="naziv" required
            defaultValue={sport.naziv} />
        </Form.Group>
        <Form.Group controlId="kategorija">
            <Form.Label>Kategorija</Form.Label>
            <Form.Select name="kategorija" required value={sport.kategorija || ''} onChange={(e) => setSport({...sport, kategorija: parseInt(e.target.value)})}>
                <option value="">Odaberite kategoriju</option>
                {kategorije && kategorije.map((kategorija) => (
                    <option key={kategorija.id} value={kategorija.id}>
                        {kategorija.naziv}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="maxIgraca">
          <Form.Label>Max Igrača</Form.Label>
          <Form.Control type="number" name="maxIgraca" step={1}
            defaultValue={sport.maxIgraca} />
        </Form.Group>
        <Form.Group controlId="trajanjeMin">
          <Form.Label>Trajanje (min)</Form.Label>
          <Form.Control type="number" name="trajanjeMin" step={1}
            defaultValue={sport.trajanjeMin} />
        </Form.Group>
        <Form.Group controlId="uZatvorenom">
          <Form.Check label="U zatvorenom" name="uZatvorenom"
            checked={uZatvorenom}
            onChange={(e) => { setuZatvorenom(e.target.checked) }}
          />
        </Form.Group>
        <Form.Group controlId="kontaktni">
          <Form.Check label="Kontaktni" name="kontaktni"
            checked={kontaktni}
            onChange={(e) => { setKontaktni(e.target.checked) }}
          />
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
              Promjeni sport
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
