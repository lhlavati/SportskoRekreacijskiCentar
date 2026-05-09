import { useEffect, useState } from "react"
import { Card, Container } from "react-bootstrap"
import useAuth from "../hooks/useAuth"
import Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import TerminService from "../services/termini/TerminService"
import SportService from "../services/sportovi/SportService"

const UKUPNO_TERMINA = 14

const BOJE_SPORTOVA = [
    '#3b82f6',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#ec4899',
    '#14b8a6',
]

const BOJA_SLOBODNI = '#22c55e'

const DANI_KRATKI = ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub']
const DANI_PUNI = ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota']
const MJESECI_KRATKI = ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro']

function normalizirajDatum(datum) {
    const dijelovi = datum.split('-').map(Number)
    return `${dijelovi[0]}-${String(dijelovi[1]).padStart(2, '0')}-${String(dijelovi[2]).padStart(2, '0')}`
}

function datumUString(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatirajRaspon(prvi, zadnji) {
    const p = `${prvi.getDate()}. ${MJESECI_KRATKI[prvi.getMonth()]}.`
    const z = `${zadnji.getDate()}. ${MJESECI_KRATKI[zadnji.getMonth()]}. ${zadnji.getFullYear()}.`
    return `${p} – ${z}`
}

const stilStrelice = (hover) => ({
    background: hover ? 'rgba(21,128,61,0.10)' : 'transparent',
    border: 'none',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#15803d',
    fontSize: 22,
    fontWeight: 700,
    transition: 'background 0.22s cubic-bezier(0.4,0,0.2,1)',
    flexShrink: 0,
    userSelect: 'none',
})

export default function NadzornaPloca() {
    const { authUser } = useAuth()
    const [termini, setTermini] = useState([])
    const [sportovi, setSportovi] = useState([])
    const [chartOptions, setChartOptions] = useState(null)
    const [tjedanOffset, setTjedanOffset] = useState(0)
    const [rasponLabel, setRasponLabel] = useState('')
    const [hoverLijevo, setHoverLijevo] = useState(false)
    const [hoverDesno, setHoverDesno] = useState(false)

    useEffect(() => {
        async function ucitaj() {
            const [odgTermini, odgSportovi] = await Promise.all([
                TerminService.get(),
                SportService.get()
            ])
            if (odgTermini.success) setTermini(odgTermini.data)
            if (odgSportovi.success) setSportovi(odgSportovi.data)
        }
        ucitaj()
    }, [])

    useEffect(() => {
        if (sportovi.length === 0) return

        const danas = new Date()
        danas.setHours(0, 0, 0, 0)

        
        const dani = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(danas)
            d.setDate(danas.getDate() + i + tjedanOffset * 7)
            return d
        })

        setRasponLabel(formatirajRaspon(dani[0], dani[6]))

        const kategorijeXOsa = dani.map((d, i) => {
            if (tjedanOffset === 0 && i === 0) return 'Danas'
            return `${DANI_KRATKI[d.getDay()]} ${d.getDate()}. ${MJESECI_KRATKI[d.getMonth()]}.`
        })

        const tooltipLabels = dani.map((d, i) => {
            const imeDana = tjedanOffset === 0 && i === 0 ? 'Danas' : DANI_PUNI[d.getDay()]
            return `${imeDana}, ${d.getDate()}. ${MJESECI_KRATKI[d.getMonth()]}.`
        })

        const zauzetiPoSportu = {}
        sportovi.forEach(s => {
            zauzetiPoSportu[s.id] = Array(7).fill(0)
        })

        dani.forEach((dan, i) => {
            const danStr = datumUString(dan)
            const terminiDana = termini.filter(t => normalizirajDatum(t.datum) === danStr)

            terminiDana.forEach(t => {
                const brSati = t.odabraniSati ? t.odabraniSati.length : 0
                if (zauzetiPoSportu[t.sport] !== undefined) {
                    zauzetiPoSportu[t.sport][i] += brSati
                }
            })
        })

        const slobodniPoOdani = dani.map((_, i) => {
            const ukupnoZauzetih = sportovi.reduce((sum, s) => sum + zauzetiPoSportu[s.id][i], 0)
            return Math.max(0, UKUPNO_TERMINA - ukupnoZauzetih)
        })

        const series = [
            ...sportovi.map((sport, idx) => ({
                name: sport.naziv,
                data: zauzetiPoSportu[sport.id],
                color: BOJE_SPORTOVA[idx % BOJE_SPORTOVA.length],
            })),
            {
                name: 'Slobodni termini',
                data: slobodniPoOdani,
                color: BOJA_SLOBODNI,
            },
        ]

        setChartOptions({
            chart: {
                type: 'column',
            },
            title: {
                text: 'Slobodni i rezervirani termini',
            },
            xAxis: {
                categories: kategorijeXOsa,
            },
            yAxis: {
                max: UKUPNO_TERMINA,
                min: 0,
                tickInterval: 1,
                title: {
                    text: 'Broj termina',
                },
            },
            tooltip: {
                formatter: function () {
                    const dayLabel = tooltipLabels[this.point.x]
                    if (this.series.name === 'Slobodni termini') {
                        return `<b>${dayLabel}</b><br/>Slobodni termini: <b>${this.y}</b>`
                    }
                    return `<b>${dayLabel}</b><br/>${this.series.name}: <b>${this.y}</b>`
                },
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    borderColor: 'rgba(0,0,0,0.08)',
                },
            },
            legend: {
                enabled: true,
            },
            credits: {
                enabled: false,
            },
            series,
        })
    }, [termini, sportovi, tjedanOffset])

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title>Dobrodošli!</Card.Title>
                    <p className="text-muted">
                        Prijavljeni ste kao <strong>{authUser.email}</strong>
                        {' '}
                        <span className={`badge ${authUser.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {authUser.uloga}
                        </span>
                    </p>
                </Card.Body>

                {chartOptions && (
                    <>
                        <div className="d-flex align-items-center justify-content-center gap-3 pb-1">
                            <button
                                style={stilStrelice(hoverLijevo)}
                                onMouseEnter={() => setHoverLijevo(true)}
                                onMouseLeave={() => setHoverLijevo(false)}
                                onClick={() => setTjedanOffset(o => o - 1)}
                                title="Prethodni tjedan"
                            >
                                ‹
                            </button>
                            <span style={{ fontWeight: 600, color: '#15803d', minWidth: 200, textAlign: 'center' }}>
                                {rasponLabel}
                            </span>
                            <button
                                style={stilStrelice(hoverDesno)}
                                onMouseEnter={() => setHoverDesno(true)}
                                onMouseLeave={() => setHoverDesno(false)}
                                onClick={() => setTjedanOffset(o => o + 1)}
                                title="Sljedeći tjedan"
                            >
                                ›
                            </button>
                        </div>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions}
                        />
                    </>
                )}
            </Card>
        </Container>
    )
}
