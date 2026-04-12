import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import ClanService from "../../services/clanovi/ClanService";

import PhoneInputWithCountrySelect, { isPossiblePhoneNumber,getCountryCallingCode } from "react-phone-number-input";
import { useState } from "react";
import 'react-phone-number-input/style.css';

export default function ClanNovi() {
  const navigate = useNavigate();
  const [kontaktBroj, setKontaktBroj] = useState('')
  const [zemlja,setZemlja]=useState('HR')

  async function dodaj(clan) {
    await ClanService.dodaj(clan).then(() => {
      navigate(RouteNames.CLANOVI);
    });
  }

  function odradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);

    let tb=podaci.get("kontaktBroj").replaceAll(' ','')
    if(tb.length>0 && tb[0]==='0'){
      tb=tb.substring(1)
    }

    tb = '+' + getCountryCallingCode(zemlja) + tb

    if (!podaci.get("kontaktBroj") || podaci.get("kontaktBroj").trim().length === 0) {
        alert(`Broj je obavezan i mora biti u formatu '911234567' bez 0 ili +385!`)
        return
    }

    if (!podaci.get('ime') || podaci.get('ime').trim().length === 0) {
        alert("Ime je obavezno i ne smije sadržavati samo razmake!")
        return
    }

    if (podaci.get('ime').trim().length < 3) {
        alert("Ime mora imati najmanje 3 znaka!")
        return
    }

    if (!podaci.get('prezime') || podaci.get('prezime').trim().length === 0) {
        alert("Prezime je obavezno i ne smije sadržavati samo razmake!")
        return
    }

    if (podaci.get('prezime').trim().length < 3) {
        alert("Prezime mora imati najmanje 3 znaka!")
        return
    }

    if (!podaci.get('email') || podaci.get('email').trim().length === 0) {
        alert("Email je obavezan i ne smije sadržavati samo razmake!")
        return
    }

    dodaj({
      ime: podaci.get("ime"),
      prezime: podaci.get("prezime"),
      email: podaci.get("email"),
      kontaktBroj: podaci.get("kontaktBroj")
    });
  }

  return (
    <>
      <h3>Unos novog člana</h3>
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="ime">
          <Form.Label>Ime</Form.Label>
          <Form.Control type="text" name="ime" required />
        </Form.Group>
        <Form.Group controlId="prezime">
          <Form.Label>Prezime</Form.Label>
          <Form.Control type="text" name="prezime" required />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="email" name="email"/>
        </Form.Group>
        <Form.Group controlId="kontaktBroj">
          <Form.Label>Kontakt broj</Form.Label>
          <br />
          <PhoneInputWithCountrySelect
            name="kontaktBroj"
            value={kontaktBroj}
            onChange={setKontaktBroj}
            defaultCountry="HR"
            international
            countryCallingCodeEditable={false}
            onCountryChange={setZemlja}
            placeholder="Primjer: 911234567"
            rules={{ required: true, validate: isPossiblePhoneNumber }}
            />
        </Form.Group>

        <hr style={{ marginTop: "20px", border: "0" }} />

        <Row>
          <Col>
            <Link to={RouteNames.CLANOVI} className="btn btn-danger">
              Odustani
            </Link>
          </Col>
          <Col>
            <Button type="sumbit" variant="success">
              Dodaj novi člana
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
