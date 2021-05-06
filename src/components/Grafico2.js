import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Line } from 'react-chartjs-2';
import './Grafico2.css'


const Grafico2 = (props) => {

    const [state, setState] = useState(0)
    const [datos, setDatos] = useState({myArray:[]})
    const [data, setData] = useState({
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
            {
                label: 'CO2 (ppm)',
                data: datos.myArray.length >= 1 ? datos.myArray : [0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 2,
            },

            {
                label: 'TU PRIMA',
                data: datos.myArray.length >= 1 ? datos.myArray : [0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 2,
            },

            
        ]
    })
    //const [client, setClient] = useState(null);
    //useState(mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt'))
    
    // const mqttConnect = (host) => {
    //     setClient(mqtt.connect(host));
    // }


    //const llamadaALaApi = () => {
        //fetch con GET al endpoint ('miIp:80/miBaseDeDatos').then((res) => {
            // setDatos(...datos.myArray.push(res.respuesta))
        // })
    //}

    //EmpezarProcedimieto = () => {
    // setInterval(() => {
        //llamadaALaApi()
   // }, 1000 (ESTO SIGNIFICA CADA CUANTO TIEMPO))
    //}


    useEffect(() => {
        const handleJsonMessage = (json) => {
            setState({...json})
            const newField = json["co2"]
            // setDatos(datos.data.push(newField))
            let myArrayCopy = datos.myArray.slice()
    
            if (myArrayCopy.length < 10)
                myArrayCopy.push(newField)
            else {
                for (var i = 0; i < 9; i++) {
                    myArrayCopy[i] = myArrayCopy[i+1]
                }
                myArrayCopy[9] = newField
            }
            console.log("myArrayCopy: ",myArrayCopy)
            setDatos((prev) => ({...prev, myArray:myArrayCopy}))
        }

        let client = mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt')
        client.on("connect", () => {
            console.log("Connected");
             client.subscribe("/tfg/react/chart/co2");
        });

        client.on("message", (topic, message) => {
            handleJsonMessage(JSON.parse(message.toString()));     
        });
        
    
        
        return () => client.end();
    }, [datos.myArray])
    

    return(
        <div>
            <h1>Sensor1: {state.co2} </h1>
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

                data={data}
             />
        

        </div>
    );
};

export default Grafico2;