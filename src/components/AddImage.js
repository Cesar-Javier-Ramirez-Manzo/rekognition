import React from "react";
import { Container, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios'
import { TiDelete, TiEdit } from 'react-icons/ti';
import { BsInputCursorText, BsCheckLg, BsFillCheckCircleFill } from 'react-icons/bs';
import { AiFillFileAdd } from 'react-icons/ai';
import imagen from '../assets/Cesar1.jpg'
class AddImage extends React.Component {



    state = {
        name: "",
        selectedFile: imagen,
        srcImage: "",
        listFaces: [],
        showItem: false,
        showModal: false,
        showModalAlert: false,
        currentFace: {
            nombre: "",
            dbId: "",
            fId: ""
        },
        handleName: ""
    }
    componentDidMount = async () => {
        this.loadFaces()
    }
    handleCloseModalAlert = () => {
        this.setState({ showModalAlert: false })
    }
    handleCloseModal = () => {
        this.setState({ showModal: false })
    }
    handleOpenModal = (e) => {
        this.setState({ handleName: e['nombre'] })
        this.setState({ currentFace: e })
        this.setState({ showModal: true })
        console.log(this.state.currentFace)
    }

    loadFaces = async () => {
        await axios.get("https://t5ggb319a1.execute-api.us-east-2.amazonaws.com/imagen/todo")
            .then(response => {
                console.log(response.data)
                this.setState({ listFaces: response.data['allNames'] })
            }).catch(error => {
                console.log(error)
            })
    }
    convertbase64 = (img) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    setImage = async (event) => {
        this.setState({ showItem: true })
        this.setState({ selectedFile: event })
        if (event) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(event);
            fileReader.onload = () => this.setState({ srcImage: fileReader.result })
            fileReader.onerror = () => console.log(fileReader.result)
        }

    }
    uploadFile = async (e) => {
        const base64 = await this.convertbase64(this.state.selectedFile)
        //console.log(base64)
        const imageData = {
            "file": base64
        }

        await axios.post("https://t5ggb319a1.execute-api.us-east-2.amazonaws.com/imagen/subir/" + this.state.name, imageData)
            .then(response => {
                console.log(response.data)
                setTimeout(() => {
                    this.setState({ showModalAlert: true })
                    this.loadFaces()
                }, 5000);

            }).catch(error => {
                console.log(error)
            })

    }
    deleteFace = async (e) => {
        var itemData = {
            "dynamoId": e['dbId'],
            "rekId": e['fId']
        }
        await axios.post("https://t5ggb319a1.execute-api.us-east-2.amazonaws.com/imagen", itemData)
            .then(response => {
                console.log(response)
                this.setState({ showModalAlert: true })
                this.loadFaces()
            }).catch(error => {
                console.log(error)
            })
    }
    editData = async (e) => {

        var updateData = {
            dbId: this.state.currentFace['dbId'],
            newName: this.state.handleName
        }

        await axios.post("https://t5ggb319a1.execute-api.us-east-2.amazonaws.com/imagen/editar", updateData)
            .then(response => {
                this.setState({ showModal: false })
                this.setState({ showModalAlert: true })
                this.loadFaces()
            }).catch(error => {
                console.log(error)
            })
    }
    render() {
        return (
            <>
                <Container className="menu" >
                    <h3 className="titles" >Agregar rostro</h3>

                    <div >


                        <form id="datos">
                            <label>Selecciona imagen de la persona</label>

                            <br></br>
                            <div>
                                <AiFillFileAdd></AiFillFileAdd>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    required
                                    id="buttonSelectFile"

                                    onChange={(e) => this.setImage(e.target.files[0])}
                                />
                                <Button variant="secondary" onClick={() => document.getElementById('buttonSelectFile').click()}>Seleccionar archivo</Button>
                            </div>

                            <img className={this.state.showItem ? "displayImage" : "elementInactive"} src={this.state.srcImage} ></img>
                            <br></br>
                            <label>Introduce un nombre para esta persona</label>
                            <br></br>
                            <div>
                                <BsInputCursorText></BsInputCursorText>
                                <input placeholder="Nombre completo" onChange={(e) => this.setState({ name: e.target.value })}>
                                </input>
                            </div>

                            <br></br>
                            <Button variant="outline-primary" onClick={() => this.uploadFile()} >Subir imagen</Button>
                        </form>


                    </div>
                    <br></br>
                    <div>
                        <h3 className="titles">Todos los rostros registrados</h3>
                        <Table striped bordered hover className="tabla">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    {/* <th>Imagen</th> */}
                                    <th>Editar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.listFaces.map((face) => (
                                    <tr >
                                        <td>{face['nombre']}</td>
                                        {/* <td><img className="tableImage" src="https://pbs.twimg.com/media/EUCh095XQAIXfbM.jpg"></img></td> */}
                                        <td><Button variant="info" onClick={() => this.handleOpenModal(face)} ><TiEdit></TiEdit></Button></td>
                                        <td><Button variant="danger" onClick={() => this.deleteFace(face)}> <TiDelete></TiDelete> </Button></td>

                                    </tr>
                                )

                                )}
                            </tbody>
                        </Table>
                    </div>
                    <Modal
                        show={this.state.showModal}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header  >
                            <Modal.Title id="contained-modal-title-vcenter">
                                Introduce el nuevo nombre
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <label>Nombre nuevo</label>
                            <br></br>
                            <input value={this.state.handleName} onChange={(e) => this.setState({ handleName: e.target.value })}></input>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.editData()} ><BsCheckLg></BsCheckLg></Button>
                            <Button variant="danger" onClick={() => this.handleCloseModal()}><TiDelete></TiDelete></Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal
                        show={this.state.showModalAlert}
                        size="sm"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header  >
                            <Modal.Title id="contained-modal-title-vcenter">
                                Proceso exitoso
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>


                        </Modal.Body>
                        <Modal.Footer>

                            <Button variant="danger" onClick={() => this.handleCloseModalAlert()}><TiDelete></TiDelete></Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </>
        )
    }
}

export default AddImage