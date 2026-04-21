import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import ClanService from "../../services/clanovi/ClanService";
import { useEffect, useState } from "react";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber, AsYouType } from "libphonenumber-js";

export default function ClanPromjena() {
  const navigate = useNavigate();
  const params = useParams();
  const [clan, setClan] = useState({});
  const [kontaktBroj, setKontaktBroj] = useState('');
  const [zemlja, setZemlja] = useState('HR');

  async function ucitajClan() {
    await ClanService.getById(params.id).then((odgovor) => {
      if (!odgovor.success) {
        alert('Nije implementiran servis');
        return;
      }

      const s = odgovor.data;
      setClan(s);
      setKontaktBroj(s.kontaktBroj);
    });
  }

  useEffect(() => {
    ucitajClan();
  }, []);

  async function promjeni(clan) {
    await ClanService.promjeni(params.id, clan).then(() => {
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

    promjeni({
      ime: ime,
      prezime: prezime,
      email: email,
      kontaktBroj: formatiraniBroj
    });
  }

  return (
    <>
      <h3>Promjena člana</h3>
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="ime" className="mb-3">
          <Form.Label>Ime</Form.Label>
          <Form.Control type="text" name="ime" required defaultValue={clan.ime} />
        </Form.Group>

        <Form.Group controlId="prezime" className="mb-3">
          <Form.Label>Prezime</Form.Label>
          <Form.Control type="text" name="prezime" required defaultValue={clan.prezime} />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="email" name="email" required defaultValue={clan.email} />
        </Form.Group>

        <Form.Group controlId="kontaktBroj" className="mb-3">
          <Form.Label>Kontakt Broj</Form.Label>
          <br />
          <PhoneInputWithCountrySelect
            name="kontaktBroj"
            value={kontaktBroj}
            onChange={setKontaktBroj}
            defaultCountry="HR"
            international
            onCountryChange={setZemlja}
          />
        </Form.Group>

        <hr style={{ marginTop: "20px", border: "0" }} />

        <div className="d-grid gap-2 d-sm-flex justify-content-sm-between mt-3">
          <Link to={RouteNames.CLANOVI} className="btn btn-danger">
            Odustani
          </Link>
          <Button type="submit" variant="success">
            Promijeni člana
          </Button>
        </div>
      </Form>
    </>
  );
}
