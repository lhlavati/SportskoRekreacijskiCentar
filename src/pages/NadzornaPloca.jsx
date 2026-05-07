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

// Normalizira datume s mogućim nedostajućim leading zerosom (npr. '2026-4-4' → '2026-04-04')
function normalizirajDatum(datum) {
    const dijelovi = datum.split('-').map(Number)
    return `${dijelovi[0]}-${String(dijelovi[1]).padStart(2, '0')}-${String(dijelovi[2]).padStart(2, '0')}`
}

function datumUString(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function NadzornaPloca() {
    const { authUser } = useAuth()
    const [termini, setTermini] = useState([])
    const [sportovi, setSportovi] = useState([])
    const [chartOptions, setChartOptions] = useState(null)

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

        // 7 dana počevši od danas
        const dani = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(danas)
            d.setDate(danas.getDate() + i)
            return d
        })

        // Kratke oznake za x-os
        const kategorijeXOsa = dani.map((d, i) => {
            if (i === 0) return 'Danas'
            return `${DANI_KRATKI[d.getDay()]} ${d.getDate()}. ${MJESECI_KRATKI[d.getMonth()]}.`
        })

        // Pune oznake za tooltip
        const tooltipLabels = dani.map((d, i) => {
            const imeDana = i === 0 ? 'Danas' : DANI_PUNI[d.getDay()]
            return `${imeDana}, ${d.getDate()}. ${MJESECI_KRATKI[d.getMonth()]}.`
        })

        // Inicijalizacija brojača po sportu i danu: { sportId: [0,0,0,0,0,0,0] }
        const zauzetiPoSportu = {}
        sportovi.forEach(s => {
            zauzetiPoSportu[s.id] = Array(7).fill(0)
        })

        // Prolaz kroz svih 7 dana i akumulacija zauzetih termina po sportu
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

        // Slobodni termini = ukupno - zauzeto (za svaki dan)
        const slobodniPoOdani = dani.map((_, i) => {
            const ukupnoZauzetih = sportovi.reduce((sum, s) => sum + zauzetiPoSportu[s.id][i], 0)
            return Math.max(0, UKUPNO_TERMINA - ukupnoZauzetih)
        })

        // Series: slobodni na dnu (zeleni), zatim svaki sport zasebno iznad
        const series = [
            {
                name: 'Slobodni termini',
                data: slobodniPoOdani,
                color: BOJA_SLOBODNI,
            },
            ...sportovi.map((sport, idx) => ({
                name: sport.naziv,
                data: zauzetiPoSportu[sport.id],
                color: BOJE_SPORTOVA[idx % BOJE_SPORTOVA.length],
            }))
        ]

        setChartOptions({
            chart: {
                type: 'column',
            },
            title: {
                text: 'Slobodni i rezervirani termini (sljedećih 7 dana)',
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
    }, [termini, sportovi])

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
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                    />
                )}
            </Card>
        </Container>
    )
}
