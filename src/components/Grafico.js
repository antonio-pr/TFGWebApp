import React from 'react';
import mqtt from 'mqtt';
import { Line } from 'react-chartjs-2';
//import Chart from 'chart.js';

//var actual_data = []

class Grafico extends React.Component{

    constructor(props) {
        super(props)
        this.state = {}
        this.datos = []
        this.client = mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt')
    }

    componentDidMount() {
        this.client.on("connect", () => {
            console.log("Connected");
            this.client.subscribe("/tfg/prueba")
        });

        this.client.on("message", (topic, message) => {
            this.handleJsonMessage(JSON.parse(message.toString()));     
        });
    }

    handleJsonMessage = (json) => {
        this.setState({...json})
        //console.log(json["co2"]);
        this.datos.push(json["co2"]);
        console.log("this.datos",this.datos);
    }

    componentWillUnmount() {
        if (this.client)
            this.client.end()
    }


//<h1>Temperatura: {this.state.co2} </h1>
//{this.datos.map((dato) => <h1> {dato} </h1>)}
    render(){
        
        //actual_data.push(this.state.co2);
       
        //console.log(actual_data);

        return(
            <div>
                <h1>CO2: {this.state.co2} </h1>
                
                <Line
                    height = {400}
                    width = {700}

                    options={{
                        maintainAspectRatio: true,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }
                            ]
                        }
                    }}

                    data={{
                        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                        datasets: [
                            {
                                label: 'CO2 (ppm)',
                                data: this.datos,
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(75, 192, 192, 1)'
                                ],
                                borderWidth: 2,
                            },
                            
                            /*
                            {
                                labels: [6, 7, 8, 9, 10],
                                data: [100, 400, 500, 600, 450],
                                backgroundColor: 'orange',
                                borderColor: 'red'
                            }
                            */
                        ]
                    }}
                 />
            </div>
        );
    }
}

export default Grafico;