import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import ClanService from "../../services/clanovi/ClanService";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { useState } from "react";
import { isValidPhoneNumber, AsYouType } from "libphonenumber-js";

export default function ClanNovi() {
  const navigate = useNavigate();
  const [kontaktBroj, setKontaktBroj] = useState('');
  const [zemlja, setZemlja] = useState('HR');

  async function dodaj(clan) {
    await ClanService.dodaj(clan).then(() => {
      navigate(RouteNames.CLANOVI);
    });
  }

  function odradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);

    const ime = podaci.get('ime')?.trim();
    const prezime = podaci.get('prezime')?.trim();
    const email = podaci.get('email')?.trim();

    if (!ime || ime.length < 3) {
        alert("Ime je obavezno i mora imati najmanje 3 znaka!");
        return;
    }

    if (!prezime || prezime.length < 3) {
        alert("Prezime je obavezno i mora imati najmanje 3 znaka!");
        return;
    }

    if (!email) {
        alert("Email je obavezan!");
        return;
    }

    if (!kontaktBroj) {
        alert("Kontakt broj je obavezan!");
        return;
    }

    if (!isValidPhoneNumber(kontaktBroj)) {
        alert("Uneseni broj telefona nije ispravan ili ne pripada odabranoj državi!");
        return;
    }

    const asYouType = new AsYouType(zemlja);
    asYouType.input(kontaktBroj);
    const formatiraniBroj = asYouType.getNumber().formatInternational(); 

    dodaj({
      ime: ime,
      prezime: prezime,
      email: email,
      kontaktBroj: formatiraniBroj
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
          <Form.Control type="email" name="email" required />
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
            {/* Ispravljen typo: bilo je type="sumbit" */}
            <Button type="submit" variant="success">
              Dodaj novog člana
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}