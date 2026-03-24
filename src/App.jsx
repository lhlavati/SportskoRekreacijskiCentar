import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Home from './pages/Home'
import SportPregled from './pages/sportovi/SportPregled'
import SportNovi from './pages/sportovi/SportNovi'

function App() {


  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.SPORTOVI} element={<SportPregled />} />
        <Route path={RouteNames.SPORTOVI_NOVI} element={<SportNovi />} />
      </Routes>
      <hr />
      &copy; Edunova
    </Container>
  )
}

export default App
