import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import ClanService from "../../services/clanovi/ClanService";
import { useEffect, useState } from "react";

import PhoneInputWithCountrySelect, { isPossiblePhoneNumber } from "react-phone-number-input";

export default function ClanPromjena() {

  const navigate = useNavigate()
  const params = useParams()
  const [clan, setClan] = useState({})
  const [kontaktBroj, setKontaktBroj] = useState('')

  async function ucitajClan() {
        await ClanService.getById(params.id).then((odgovor)=>{
            
            // console.log(!odgovor.success);
            
            // if(!odgovor.success){
            //   alert('Nije implementiran servis')
            //   return
            // }

            const s = odgovor.data
            
            setClan(s)
            setKontaktBroj(s.kontaktBroj)
            
        })
    }

    useEffect(()=>{
        ucitajClan()
    },[])

    async function promjeni(clan){
        await ClanService.promjeni(params.id, clan).then(()=>{
            navigate(RouteNames.CLANOVI)
        })
    }

  function odradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    promjeni({
      ime: podaci.get("ime"),
      prezime: podaci.get("prezime"),
      email: podaci.get("email"),
      kontaktBroj:podaci.get("kontaktBroj")
    });
  }

  return (
    <>
      <h3>Unos novog člana</h3>
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="ime">
          <Form.Label>Ime</Form.Label>
          <Form.Control type="text" name="ime" required 
          defaultValue={clan.ime}/>
        </Form.Group>
        <Form.Group controlId="prezime">
          <Form.Label>Prezime</Form.Label>
          <Form.Control type="text" name="prezime" required 
          defaultValue={clan.prezime}/>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="email" name="email" required
          defaultValue={clan.email}/>
        </Form.Group>
        <Form.Group controlId="kontaktBroj">
          <Form.Label>Kontakt Broj</Form.Label>
          <br />
          <PhoneInputWithCountrySelect
            name="kontaktBroj"
            value={clan.kontaktBroj}
            onChange={setKontaktBroj}
            required
            defaultCountry="HR"
            displayInitialValueAsLocalNumber
            rules={{ required: true}}
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
              Promjeni člana
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
