import React from "react";
import { Container } from "react-bootstrap";
import logo from '../assets/Logo.png'
class Home extends React.Component{


    render(){
        return(
            <Container className="menu">
                <h1 className="titles">Bienvenido a RecoCam</h1>
                <label>Comienza a facilitar tu vida</label>
                <img src={logo} ></img>

            </Container>
        )
    }
}

export default Home