import React from "react";
import { Container, Button, Table, Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player'
import axios from 'axios'
import AWS from 'aws-sdk'

const S3_BUCKET = 'rekognition-videos-recocam';
const REGION = 'us-east-2';

AWS.config.update({
    accessKeyId: 'AKIA2LFM5K7DDEKNZPV6',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
})

class VideoSearch extends React.Component {
    state = {
        selectedFile: "",
        videoFile: "",
        idRetrieve: "",
        stampsData: [],
        namesData: []
    }

    ref = player => {
        this.player = player
    }

    setVideo = (file) => {
        this.setState({ selectedFile: file, videoFile: URL.createObjectURL(file) })


    }
    convertBase64 = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    startSearch = async () => {

        var params = {
            Body: this.state.selectedFile,
            Bucket: S3_BUCKET,
            Key: this.state.selectedFile.name
        };

        var response = await myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                console.log(evt)
            })
            .send((err) => {
                if (err) console.log(err)
            })

        var suceeded = false

        var resultsRequest = []
        var resultsNames = []
        await new Promise(resolve => setTimeout(resolve, 5000));
        while (suceeded == false) {

            console.log(this.state.stampsData)
            var resultsFetch = await axios.get("https://t5ggb319a1.execute-api.us-east-2.amazonaws.com/buscar/video/resultado")
                .then(response => {
                    resultsRequest = response.data.dbResponse.Item.faces.S
                    resultsNames = response.data.facesResult
                    console.log(response.data)

                }).catch(error => {
                    console.log(error)
                })
            await new Promise(resolve => setTimeout(resolve, 5000));
            var parsedData = JSON.parse(resultsRequest)
            console.log(parsedData)
            //resultsRequest = resultsFetch['Item']['faces']
            if (parsedData.length > 1) {
                suceeded = true
                this.setState({ stampsData: parsedData })
                this.setState({ namesData: resultsNames })
            }

        }
    }

    milisToMinutes = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    getName = (indice) =>{
        var nombre= ""
        for(var i =0;i<this.state.namesData.length; i++ ){
            if(indice == this.state.namesData[i]['personId']){
                nombre = this.state.namesData[i]['nombre']
            }
        }
        return nombre
    }
        
    handleVideo = (miliSeconds) =>{
        var seekSeconds = ((miliSeconds % 60000) / 1000).toFixed(0);
        this.player.seekTo(seekSeconds,'seconds')
    }

    render() {
        return (
            <Container className="menu">
                <input type="file"
                    accept="video/*"

                    onChange={(e) => this.setVideo(e.target.files[0])}
                ></input>
                <br></br>
                <ReactPlayer ref={this.ref} url={this.state.videoFile} controls></ReactPlayer>
                <button onClick={() => this.startSearch()}>Subir</button>

                <Table striped bordered hover className="tabla">
                    <thead>
                        <tr>
                            <th>Segundo</th>
                            <th>Nombre</th>
                            {/* <th>Imagen</th> */}
                            <th>Ubicar</th>

                        </tr>

                    </thead>
                    <tbody>
                        {this.state.stampsData.map((timeStamp) => (
                            <tr >
                                <td>{this.milisToMinutes(timeStamp['Timestamp'])}</td>
                                <td>{this.getName(timeStamp['Person']['Index'])}</td>
                                {/* <td><img className="tableImage" src="https://pbs.twimg.com/media/EUCh095XQAIXfbM.jpg"></img></td> */}
                                <td><Button variant="danger" onClick={() => this.handleVideo(timeStamp['Timestamp'])}>  </Button></td>

                            </tr>
                        )

                        )}
                    </tbody>
                </Table>
            </Container>
        )
    }
}

export default VideoSearch