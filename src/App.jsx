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

function App() {

  return (
    <Container style={ {backgroundColor: window.location.hostname === 'localhost' ? '#ffefea' : 'none'}}>
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
        <Route path={RouteNames.KATEGORJIE_PROMJENA} element={<KategorijaPromjena />} />

      </Routes>
      <hr />
      &copy; {IME_APLIKACIJE}
    </Container>
  )
}

export default App
