import { useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { GiSoccerBall } from "react-icons/gi";
import { BsTags, BsPeople, BsCalendar } from "react-icons/bs";

import { RouteNames } from "../constants";
import SportService from "../services/sportovi/SportService";
import KategorijaService from "../services/kategorije/KategorijaService";
import ClanService from "../services/clanovi/ClanService";
import TerminService from "../services/termini/TerminService";

const kartice = [
  {
    kljuc: "sportovi",
    naslov: "Sportovi",
    ikona: GiSoccerBall,
    ruta: RouteNames.SPORTOVI,
    boja: "linear-gradient(135deg, #052e16 0%, #166534 100%)",
  },
  {
    kljuc: "kategorije",
    naslov: "Kategorije",
    ikona: BsTags,
    ruta: RouteNames.KATEGORIJE,
    boja: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
  },
  {
    kljuc: "clanovi",
    naslov: "Članovi",
    ikona: BsPeople,
    ruta: RouteNames.CLANOVI,
    boja: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
  },
  {
    kljuc: "termini",
    naslov: "Termini",
    ikona: BsCalendar,
    ruta: RouteNames.TERMINI,
    boja: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
  },
];

export default function Home() {
  const [statistika, setStatistika] = useState({ sportovi: 0, kategorije: 0, clanovi: 0, termini: 0 });
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    ucitajStatistiku();
  }, []);

  async function ucitajStatistiku() {
    setUcitavanje(true);
    const [sportovi, kategorije, clanovi, termini] = await Promise.all([
      SportService.get(),
      KategorijaService.get(),
      ClanService.get(),
      TerminService.get(),
    ]);
    setStatistika({
      sportovi: sportovi?.data?.length ?? 0,
      kategorije: kategorije?.data?.length ?? 0,
      clanovi: clanovi?.data?.length ?? 0,
      termini: termini?.data?.length ?? 0,
    });
    setUcitavanje(false);
  }

  return (
    <>
      <div className="text-center" style={{ maxWidth: "380px", margin: "auto" }}>
        <DotLottieReact
          src="/Soccer_Sport_Trophy_with_Soccer_Ball_and_Shoes.lottie"
          loop
          autoplay
        />
      </div>

      <div className="mt-4 mb-5">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <h3 className="mb-0 fw-bold">Pregled statistike</h3>
          {ucitavanje && <Spinner animation="border" size="sm" />}
        </div>

        <Row className="g-3">
          {kartice.map((k) => {
            const Ikona = k.ikona;
            const broj = statistika[k.kljuc];
            return (
              <Col xs={12} md={3} key={k.kljuc}>
                <Card
                  as={Link}
                  to={k.ruta}
                  className="shadow-sm border-0 rounded-4 h-100 text-decoration-none stat-kartica"
                  style={{
                    overflow: "hidden",
                    transition: "transform .2s ease, box-shadow .2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div style={{ height: "6px", background: k.boja }} />
                  <Card.Body className="d-flex align-items-center gap-3 p-4">
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: k.boja,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      <Ikona size={28} />
                    </div>
                    <div>
                      <div className="text-muted small text-uppercase fw-semibold">
                        {k.naslov}
                      </div>
                      <div className="fw-bold" style={{ fontSize: "2rem", lineHeight: 1 }}>
                        {ucitavanje ? "—" : broj}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
}
