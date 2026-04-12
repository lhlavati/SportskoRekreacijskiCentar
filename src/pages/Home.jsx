import { Image } from "react-bootstrap";
import { IME_APLIKACIJE } from "../constants";
import logo from '../assets/logo.png'
import animacija from '../assets/logo.png'
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home(){
    return(
    <>
        <div className="text-center" style={{maxWidth: '500px', margin: 'auto'}}>
            <DotLottieReact
                src="/Soccer_Sport_Trophy_with_Soccer_Ball_and_Shoes.lottie"
                loop
                autoplay
            />
        </div>
    </>
    )
}