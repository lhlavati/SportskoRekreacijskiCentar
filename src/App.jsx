import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { IME_APLIKACIJE, RouteNames } from './constants'
import Home from './pages/Home'
import SportPregled from './pages/sportovi/SportPregled'
import SportNovi from './pages/sportovi/SportNovi'
import SportPromjena from './pages/sportovi/SportPromjena'
import ClanNovi from './pages/clanovi/ClanNovi'
import ClanPromjena from './pages/clanovi/ClanPromjena'
import ClanPregled from './pages/clanovi/ClanPregled'
import KategorijaNovi from './pages/kategorije/KategorijaNovi'
import KategorijaPregled from './pages/kategorije/KategorijaPregled'
import KategorijaPromjena from './pages/kategorije/KategorijaPromjena'
import GeneriranjePodataka from './pages/GeneriranjePodataka'
import TerminPregled from './pages/termini/TerminPregled'
import TerminNovi from './pages/termini/TerminNovi'
import TerminPromjena from './pages/termini/TerminPromjena'

function App() {

  return (
    <Container className="src-app">
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.SPORTOVI} element={<SportPregled />} />
        <Route path={RouteNames.SPORTOVI_NOVI} element={<SportNovi />} />
        <Route path={RouteNames.SPORTOVI_PROMJENA} element={<SportPromjena />} />
        <Route path={RouteNames.CLANOVI} element={<ClanPregled />} />
        <Route path={RouteNames.CLANOVI_NOVI} element={<ClanNovi />} />
        <Route path={RouteNames.CLANOVI_PROMJENA} element={<ClanPromjena />} />
        <Route path={RouteNames.KATEGORIJE} element={<KategorijaPregled />} />
        <Route path={RouteNames.KATEGORIJE_NOVI} element={<KategorijaNovi />} />
        <Route path={RouteNames.KATEGORIJE_PROMJENA} element={<KategorijaPromjena />} />
        <Route path={RouteNames.TERMINI} element={<TerminPregled />} />
        <Route path={RouteNames.TERMINI_NOVI} element={<TerminNovi />} />
        <Route path={RouteNames.TERMINI_PROMJENA} element={<TerminPromjena />} />

        <Route path={RouteNames.GENERIRAJ_PODATKE} element={<GeneriranjePodataka />} />

      </Routes>
      <hr />
      <p className="src-footer">&copy; {IME_APLIKACIJE}</p>
    </Container>
  )
}

export default App
