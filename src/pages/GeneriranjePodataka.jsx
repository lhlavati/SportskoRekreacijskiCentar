import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsTags, BsPeople, BsDatabaseFillAdd, BsInfoCircle } from "react-icons/bs";
import { GiSoccerBall } from "react-icons/gi";
import { fakerHR as faker } from "@faker-js/faker";

import { RouteNames } from "../constants";
import SportService from "../services/sportovi/SportService";
import KategorijaService from "../services/kategorije/KategorijaService";
import ClanService from "../services/clanovi/ClanService";

const SPORTSKE_KATEGORIJE = [
  "Momčadski sportovi",
  "Individualni sportovi",
  "Borilački sportovi",
  "Vodeni sportovi",
  "Zimski sportovi",
  "Atletika",
  "Ekstremni sportovi",
  "Rekreacija",
  "Fitness",
  "Plesni sportovi",
  "Precizni sportovi",
  "Motorni sportovi",
];

const NAZIVI_SPORTOVA = [
  "Nogomet", "Košarka", "Rukomet", "Odbojka", "Tenis", "Stolni tenis",
  "Badminton", "Boks", "Judo", "Karate", "Taekwondo", "Hrvanje",
  "Plivanje", "Vaterpolo", "Veslanje", "Jedrenje", "Skijanje", "Snowboarding",
  "Trčanje", "Maraton", "Skok u vis", "Skok u dalj", "Bacanje kugle",
  "Biciklizam", "Gimnastika", "Joga", "Pilates", "CrossFit", "Aerobik",
  "Ples", "Balet", "Pikado", "Kuglanje", "Streličarstvo", "Golf",
];

const RASPONI = {
  kategorije: { min: 1, max: 50 },
  sportovi: { min: 1, max: 200 },
  clanovi: { min: 1, max: 500 },
};

function hrKontaktBroj() {
  const mreza = faker.helpers.arrayElement(["91", "92", "95", "97", "98", "99"]);
  const drugi = faker.string.numeric(3);
  const treci = faker.string.numeric(4);
  return `+385 ${mreza} ${drugi} ${treci}`;
}

export default function GeneriranjePodataka() {
  const [brojKategorija, setBrojKategorija] = useState(5);
  const [brojSportova, setBrojSportova] = useState(15);
  const [brojClanova, setBrojClanova] = useState(30);
  const [obrisiPostojece, setObrisiPostojece] = useState(false);
  const [generira, setGeneria] = useState(false);
  const [rezultat, setRezultat] = useState(null);
  const [greska, setGreska] = useState("");

  function validirajBroj(vrijednost, naziv, { min, max }) {
    const broj = Number(vrijednost);
    if (!Number.isInteger(broj)) {
      return `${naziv} mora biti cijeli broj.`;
    }
    if (broj < min || broj > max) {
      return `${naziv} mora biti između ${min} i ${max}.`;
    }
    return null;
  }

  async function obrisiSve() {
    const [sportovi, clanovi, kategorije] = await Promise.all([
      SportService.get(),
      ClanService.get(),
      KategorijaService.get(),
    ]);
    await Promise.all((sportovi?.data ?? []).map((s) => SportService.obrisi(s.id)));
    await Promise.all((clanovi?.data ?? []).map((c) => ClanService.obrisi(c.id)));
    await Promise.all((kategorije?.data ?? []).map((k) => KategorijaService.obrisi(k.id)));
  }

  async function odradiSubmit(e) {
    e.preventDefault();
    setGreska("");
    setRezultat(null);

    const greske = [
      validirajBroj(brojKategorija, "Broj kategorija", RASPONI.kategorije),
      validirajBroj(brojSportova, "Broj sportova", RASPONI.sportovi),
      validirajBroj(brojClanova, "Broj članova", RASPONI.clanovi),
    ].filter(Boolean);

    if (greske.length) {
      setGreska(greske.join(" "));
      return;
    }

    setGeneria(true);
    try {
      if (obrisiPostojece) {
        await obrisiSve();
      }

      const novaKategorijeIds = [];
      const vecPostojece = obrisiPostojece
        ? { data: [] }
        : await KategorijaService.get();
      const postojeceIds = (vecPostojece?.data ?? []).map((k) => k.id);

      const koristeneKategorije = faker.helpers.arrayElements(
        SPORTSKE_KATEGORIJE,
        Math.min(Number(brojKategorija), SPORTSKE_KATEGORIJE.length)
      );
      for (let i = 0; i < Number(brojKategorija); i++) {
        const naziv =
          koristeneKategorije[i] ??
          `${faker.helpers.arrayElement(SPORTSKE_KATEGORIJE)} ${i + 1}`;
        const odgovor = await KategorijaService.dodaj({ naziv });
        if (odgovor?.data?.id) {
          novaKategorijeIds.push(odgovor.data.id);
        }
      }

      const sveKategorijeIds = [...postojeceIds, ...novaKategorijeIds];

      if (Number(brojSportova) > 0 && sveKategorijeIds.length === 0) {
        throw new Error(
          "Za generiranje sportova mora postojati barem jedna kategorija."
        );
      }

      let upisanoSportova = 0;
      for (let i = 0; i < Number(brojSportova); i++) {
        const naziv = `${faker.helpers.arrayElement(NAZIVI_SPORTOVA)} ${faker.number.int({ min: 1, max: 999 })}`;
        await SportService.dodaj({
          naziv,
          kategorija: faker.helpers.arrayElement(sveKategorijeIds),
          kontaktni: faker.datatype.boolean(),
          maxIgraca: faker.number.int({ min: 1, max: 30 }),
          uZatvorenom: faker.datatype.boolean(),
          trajanjeMin: faker.number.int({ min: 10, max: 180 }),
        });
        upisanoSportova++;
      }

      let upisanoClanova = 0;
      for (let i = 0; i < Number(brojClanova); i++) {
        const ime = faker.person.firstName();
        const prezime = faker.person.lastName();
        await ClanService.dodaj({
          ime,
          prezime,
          email: faker.internet
            .email({ firstName: ime, lastName: prezime })
            .toLowerCase(),
          kontaktBroj: hrKontaktBroj(),
        });
        upisanoClanova++;
      }

      setRezultat({
        kategorije: novaKategorijeIds.length,
        sportovi: upisanoSportova,
        clanovi: upisanoClanova,
      });
    } catch (err) {
      setGreska(err?.message ?? "Došlo je do greške prilikom generiranja.");
    } finally {
      setGeneria(false);
    }
  }

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: "860px" }}>
      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <div
          style={{
            height: "6px",
            background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
          }}
        />
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <BsDatabaseFillAdd size={28} />
            </div>
            <div>
              <h3 className="mb-0 fw-bold">Generator demo podataka</h3>
              <div className="text-muted small">
                Lažirani podaci za testiranje — HR lokalizacija (@faker-js/faker)
              </div>
            </div>
          </div>

          <Alert variant="info" className="d-flex gap-2 align-items-start rounded-4 border-0">
            <BsInfoCircle size={20} className="flex-shrink-0 mt-1" />
            <div className="small">
              Svi generirani podaci su <strong>lažni</strong> i služe isključivo za
              razvoj i testiranje. Imena, e-mail adrese i brojevi telefona ne
              pripadaju stvarnim osobama.
            </div>
          </Alert>

          <Form onSubmit={odradiSubmit} noValidate>
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Group controlId="brojKategorija">
                  <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                    <BsTags /> Broj kategorija
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      min={RASPONI.kategorije.min}
                      max={RASPONI.kategorije.max}
                      step={1}
                      value={brojKategorija}
                      onChange={(e) => setBrojKategorija(e.target.value)}
                      required
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    {RASPONI.kategorije.min}–{RASPONI.kategorije.max}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group controlId="brojSportova">
                  <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                    <GiSoccerBall /> Broj sportova
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={RASPONI.sportovi.min}
                    max={RASPONI.sportovi.max}
                    step={1}
                    value={brojSportova}
                    onChange={(e) => setBrojSportova(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    {RASPONI.sportovi.min}–{RASPONI.sportovi.max}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group controlId="brojClanova">
                  <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                    <BsPeople /> Broj članova
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={RASPONI.clanovi.min}
                    max={RASPONI.clanovi.max}
                    step={1}
                    value={brojClanova}
                    onChange={(e) => setBrojClanova(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    {RASPONI.clanovi.min}–{RASPONI.clanovi.max}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="obrisiPostojece" className="mt-4">
              <Form.Check
                type="switch"
                label="Obriši postojeće podatke prije generiranja"
                checked={obrisiPostojece}
                onChange={(e) => setObrisiPostojece(e.target.checked)}
              />
            </Form.Group>

            {greska && (
              <Alert variant="danger" className="mt-4 rounded-4 border-0">
                {greska}
              </Alert>
            )}

            {rezultat && (
              <Alert variant="success" className="mt-4 rounded-4 border-0">
                <div className="fw-semibold mb-1">Generiranje uspješno!</div>
                <div className="small">
                  Upisano: <strong>{rezultat.kategorije}</strong> kategorija,{" "}
                  <strong>{rezultat.sportovi}</strong> sportova,{" "}
                  <strong>{rezultat.clanovi}</strong> članova.{" "}
                  <Link to={RouteNames.HOME}>Vrati se na početnu</Link>.
                </div>
              </Alert>
            )}

            <hr className="my-4" />

            <div className="d-flex flex-column flex-md-row gap-2 justify-content-end">
              <Link
                to={RouteNames.HOME}
                className="btn btn-outline-secondary rounded-3 px-4"
              >
                Odustani
              </Link>
              <Button
                type="submit"
                variant="success"
                className="rounded-3 px-4"
                disabled={generira}
              >
                {generira ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Generiranje…
                  </>
                ) : (
                  "Generiraj podatke"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
