import { useEffect, useState } from "react"
import { Badge, Button, Col, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FaCalendarAlt, FaClock, FaEuroSign, FaUser, FaUsers, FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import { RouteNames } from "../../constants"
import TerminService from "../../services/termini/TerminService"

const stilKartice = (jeHover) => ({
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.35)',
    borderRadius: '16px',
    boxShadow: jeHover
        ? '0 16px 48px rgba(22,163,74,0.22)'
        : '0 8px 32px rgba(0,0,0,0.10)',
    transform: jeHover ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    overflow: 'hidden',
    marginBottom: '24px',
})

const stilZaglavlja = {
    background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
    borderRadius: '16px 16px 0 0',
    padding: '16px 20px',
    color: '#fff',
}

const stilDodajGumb = {
    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '10px 28px',
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(22,163,74,0.40)',
    color: '#fff',
    cursor: 'pointer',
}

function formatirajDatum(iso) {
    if (!iso) return '—'
    const d = new Date(iso)
    const pad = n => String(n).padStart(2, '0')
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} u ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function TerminPregled() {

    const navigate = useNavigate()
    const [termini, setTermini] = useState([])
    const [hoverIds, setHoverIds] = useState([])

    useEffect(() => {
        ucitajTermine()
    }, [])

    async function ucitajTermine() {
        await TerminService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setTermini(odgovor.data)
        })
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        await TerminService.obrisi(id)
        ucitajTermine()
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <h2 className="fw-bold mb-0">Termini</h2>
                <Link to={RouteNames.TERMINI_NOVI}>
                    <button style={stilDodajGumb}>
                        <FaPlus className="me-2" />
                        Dodaj novi termin
                    </button>
                </Link>
            </div>

            <Row xs={1} sm={2} lg={3}>
                {termini.map((termin) => {
                    const jeHover = hoverIds.includes(termin.id)
                    return (
                        <Col key={termin.id}>
                            <div
                                style={stilKartice(jeHover)}
                                onMouseEnter={() => setHoverIds(prev => [...prev, termin.id])}
                                onMouseLeave={() => setHoverIds(prev => prev.filter(i => i !== termin.id))}
                            >
                                <div style={stilZaglavlja}>
                                    <div className="d-flex align-items-center gap-2">
                                        <FaCalendarAlt />
                                        <span className="fw-semibold small">
                                            {formatirajDatum(termin.datumPocetka)}
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mt-1" style={{ opacity: 0.8 }}>
                                        <FaClock size={12} />
                                        <span style={{ fontSize: '0.8rem' }}>
                                            do {formatirajDatum(termin.datumKraja)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ padding: '20px' }}>
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <FaEuroSign color="#16a34a" />
                                        <span className="fw-bold fs-5">{termin.cijena} €</span>
                                    </div>

                                    <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
                                        <FaUser />
                                        <span>Rezervirao: <strong>#{termin.rezervirao}</strong></span>
                                    </div>

                                    <div className="d-flex align-items-start gap-2 mb-3 flex-wrap">
                                        <FaUsers color="#15803d" className="mt-1 flex-shrink-0" />
                                        <div className="d-flex flex-wrap gap-1">
                                            {termin.sudionici && termin.sudionici.map((id) => (
                                                <Badge key={id} bg="primary" pill>#{id}</Badge>
                                            ))}
                                            {(!termin.sudionici || termin.sudionici.length === 0) && (
                                                <span className="text-muted small">Nema sudionika</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="flex-fill"
                                            onClick={() => navigate(`/termini/${termin.id}`)}
                                        >
                                            <FaEdit className="me-1" />Promjena
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            className="flex-fill"
                                            onClick={() => obrisi(termin.id)}
                                        >
                                            <FaTrash className="me-1" />Obriši
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>

            {termini.length === 0 && (
                <div className="text-center text-muted py-5">
                    <FaCalendarAlt size={48} style={{ opacity: 0.2 }} />
                    <p className="mt-3">Nema termina. Dodajte prvi!</p>
                </div>
            )}
        </>
    )
}
