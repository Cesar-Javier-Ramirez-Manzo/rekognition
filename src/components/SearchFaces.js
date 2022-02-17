import React, { useRef, useEffect } from "react";
import { Container, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios'
import { AiFillFileAdd } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';

class SearchFaces extends React.Component {
    constructor(props) {
        super(props)
        this.canvas = React.createRef()
    }
    state = {
        selectedFile: "",
        imageBase64: "",
        srcImage: "https://www.claro.com.co/portal/co/noticias/imagenes/1622551024510-5-og-frases%20para%20la%20familia.jpg",
        facesMatches: [],
        showModalFailed: false,
        isActiveFaces: false,
        isActiveTable: false
    }
    handleCloseModalFailed = () => {
        this.setState({ showModalFailed: false })
    }
    setImage = async (event) => {
        this.setState({ selectedFile: event })
        var canvas = document.getElementById("lienzo");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (event) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(event);
            fileReader.onload = () => this.setState({ srcImage: fileReader.result })
            fileReader.onerror = () => console.log(fileReader.result)
        }
        console.log(this.state.selectedFile)
    }
    detectEach = async (moreBoxes) => {
        var canvas = document.getElementById("lienzo");
        var ctx = canvas.getContext("2d");
        var image = new Image()
        image.src = this.state.srcImage
        var iWidth = image.width
        var iHeight = image.height
        var arrayNames = []
        for (var i = 0; i < moreBoxes.length; i++) {
            var x1 = JSON.stringify(moreBoxes[i]['BoundingBox']['Left']) * iWidth
            var y1 = JSON.stringify(moreBoxes[i]['BoundingBox']['Top']) * iHeight
            var x2 = (JSON.stringify(moreBoxes[i]['BoundingBox']['Width']) * iWidth)
            var y2 = (JSON.stringify(moreBoxes[i]['BoundingBox']['Height']) * iHeight)


            ctx.drawImage(image, x1, y1, x2, y2, 0, 10, 100, 100);
            var individualImage = await canvas.toDataURL("image/jpeg")
            var individualData = {
                "file": individualImage
            }

            await axios.post("https://t5ggb319a1.execute-api.us-east-2.amazonaws.com/buscar/imagen/unica", individualData)
                .then(response => {
                    if (response.data['nombre'] == "NoMatches") {
                        //this.setState({showModalFailed: true}) 
                        arrayNames.push("No identificado")
                    } else {
                        arrayNames.push(JSON.stringify(response.data['nombre']))
                    }

                }).catch(error => {
                    console.log(error)
                })

        }

        this.setState({ isActiveFaces: false, isActiveTable: true, facesMatches: arrayNames })
        this.drawBox(moreBoxes)

    }
    drawBox = async (boxes) => {
        //var canvas = document.getElementById("lienzo");
        var canvas = document.getElementsByTagName("canvas")
        var image = new Image()
        image.src = this.state.srcImage
        var iWidth = image.width
        var iHeight = image.height
        var moveNext = 0

        for (var i = 0; i < boxes.length; i++) {
            var ctx = canvas[i + 1].getContext("2d");
            var x1 = JSON.stringify(boxes[i]['BoundingBox']['Left']) * iWidth
            var y1 = JSON.stringify(boxes[i]['BoundingBox']['Top']) * iHeight
            var x2 = (JSON.stringify(boxes[i]['BoundingBox']['Width']) * iWidth)
            var y2 = (JSON.stringify(boxes[i]['BoundingBox']['Height']) * iHeight)
            ctx.drawImage(image, x1, y1, x2, y2, 10, 10, 100, 100);
            moveNext += 102
        }




    }
    convertbase64 = (img) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    uploadImage = async () => {
        const base64 = await this.convertbase64(this.state.selectedFile)
        const imageData = {
            "file": base64
        }

        await axios.post("https://t5ggb319a1.execute-api.us-east-2.amazonaws.com/buscar/imagen", imageData)
            .then(response => {

                
                this.detectEach(response.data['detectedFaces']['FaceDetails'])
            }).catch(error => {
                console.log(error)
            })
    }


    render() {
        return (
            <>
                <Container className="menu">
                    <h3 className="titles">Selecciona imagen a buscar</h3>
                    <br></br>
                    <div>

                        <AiFillFileAdd></AiFillFileAdd><input type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            id="buttonSelectedFile"
                            onChange={(e) => this.setImage(e.target.files[0])}>

                        </input>

                        <Button variant="secondary" onClick={() => document.getElementById('buttonSelectedFile').click()}>Seleccionar archivo</Button>
                    </div>
                    <br></br>
                    <div id="imagesBox">
                        <div className={this.state.isActiveFaces ? 'columnas ' : 'elementInactive'}>
                            <label>Rostros detectados</label>
                            <canvas ref={this.canvas} className="displayImage" id="lienzo">Rostros </canvas>
                        </div>
                        <div className="columnas">
                            <label>Imagen a buscar</label>
                            <img className="displayImage" id="searchImage" src={this.state.srcImage}>

                            </img>
                        </div>


                    </div>
                    <br></br>
                    <div>
                        <Button variant="outline-primary" onClick={() => this.uploadImage()} >Buscar personas</Button>
                    </div>
                    <br></br>
                    <h3 className={this.state.isActiveTable ? 'title ' : 'elementInactive'}>Personas encontradas</h3>
                    <Table striped bordered hover id="tabla" className={this.state.isActiveTable ? 'tabla ' : 'elementInactive'}>
                        <thead>
                            <tr>
                                <th>Identificacion</th>
                                <th>Persona</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.facesMatches.map((nombre) => (
                                <tr >
                                    <td>{nombre}</td>
                                    <td><canvas className="tableImage"></canvas></td>
                                </tr>
                            )

                            )}
                        </tbody>
                    </Table>
                    <Modal
                        show={this.state.showModalFailed}
                        size="sm"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header  >
                            <Modal.Title id="contained-modal-title-vcenter">
                                Ningun resultado
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>


                        </Modal.Body>
                        <Modal.Footer>

                            <Button variant="danger" onClick={() => this.handleCloseModalFailed()}><TiDelete></TiDelete></Button>
                        </Modal.Footer>
                    </Modal>
                </Container>


            </>

        )
    }

}

export default SearchFaces;