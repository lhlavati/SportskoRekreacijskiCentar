import { Image } from "react-bootstrap";
import { IME_APLIKACIJE } from "../constants";
import logo from '../assets/logo.png'

export default function Home(){
    return(
    <>
        <h1 className="text-center">Dobrodošli na {IME_APLIKACIJE}</h1>
        <div className="text-center">
            <Image src={logo} fluid />
        </div>
    </>
    )
}