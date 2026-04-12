import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import ClanService from "../../services/clanovi/ClanService";
import { useEffect, useState } from "react";

import PhoneInputWithCountrySelect, { isPossiblePhoneNumber, getCountryCallingCode } from "react-phone-number-input";
import 'react-phone-number-input/style.css'

export default function ClanPromjena() {

  const navigate = useNavigate()
  const params = useParams()
  const [clan, setClan] = useState({})
  const [kontaktBroj, setKontaktBroj] = useState('')
  const [zemlja,setZemlja]=useState('HR')

  async function ucitajClan() {
        await ClanService.getById(params.id).then((odgovor)=>{
            
            if(!odgovor.success){
               alert('Nije implementiran servis')
              return
            }

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

    promjeni({
      ime: podaci.get("ime"),
      prezime: podaci.get("prezime"),
      email: podaci.get("email"),
      kontaktBroj: tb
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
            useNationalFormatForDefaultCountryValue={false}
            value={clan.kontaktBroj}
            onChange={setKontaktBroj}
            required
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
