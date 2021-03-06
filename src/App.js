import './App.css';
import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

//Importar componentes
//import Grafico from './components/Grafico'
// import Grafico2 from './components/Grafico2'
// import Grafico3 from './components/Grafico3'
import Grafico4 from './components/Grafico4'

function App() {
    const [data, setData] = useState()
    const [state, setState] = useState(0)
    const [datos, setDatos] = useState({
    })

    useEffect(() => {
        const getData = () => {

            setData({
                labels: [1,2,3,4,5,6,7,8,9,10],
                datasets: [
                    {
                        label: 'CO2 (ppm)',
                        data: datos.sensor1,
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
                        data: datos.sensor2,
                        backgroundColor: [
                        'rgba(75, 75, 192, 0.2)'
                        ],
                        borderColor: [
                        'rgba(75, 75, 192, 1)'
                        ],
                        borderWidth: 2,
                    }
                ]
            })
        }

        const handleJsonMessage = (json,sensor) => {
            //setState({...json})
            setState(json["co2"])
            const newField = json["co2"]
            var myArrayCopy = []
            const updatedValue = {}


            if(datos.hasOwnProperty(sensor))
            {
                console.log("Ha sido encontrado:", sensor)
                myArrayCopy = datos[sensor].slice()
                if (myArrayCopy.length < 10)
                    myArrayCopy.push(newField)
                else {
                    for (var i = 0; i < 9; i++) {
                        myArrayCopy[i] = myArrayCopy[i+1]
                    }
                    myArrayCopy[9] = newField
                }
                updatedValue[sensor] = myArrayCopy
            }else{
                console.log("NO ha sido encontrado:", sensor)
                updatedValue[sensor] = [newField]
            }

            setDatos({
                ...datos,
                ...updatedValue
            })

            console.log(datos)

            getData()
        }

        // const handleJsonMessage = (json,sensor) => {
        //     //setState({...json})
        //     setState(json["co2"])
        //     const newField = json["co2"]
            

        //     if(datos.hasOwnProperty(sensor))
        //     {
        //         console.log("Ha sido encontrado:", sensor)
        //     }else{
        //         console.log("NO ha sido encontrado:", sensor)
        //     }

        //     let myArrayCopy = datos[sensor].slice()
        //     if (myArrayCopy.length < 10)
        //         myArrayCopy.push(newField)
        //     else {
        //         for (var i = 0; i < 9; i++) {
        //             myArrayCopy[i] = myArrayCopy[i+1]
        //         }
        //         myArrayCopy[9] = newField
        //     }

        //     setDatos({
        //         sensor1: myArrayCopy
        //     })
        //     getData()
        // }

        getData();
        let client = mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt')
        client.on("connect", () => {
            console.log("Connected");
            client.subscribe("/tfg/react/chart/co2/#");
        });

        client.on("message", (topic, message) => {
            let regex = /(sensor\d+)/g;
            let coincidence = topic.match(regex);
            console.log()
            handleJsonMessage(JSON.parse(message.toString()), coincidence);     
         });

    
        return () => client.end();
    }, [datos]);
  
  //<Grafico3 chartData={data} co2={6344}/>
  return (
    <div className="App">
        <header className="App-header">
        <Grafico4 chartData={data} co2={state}/>
        </header>
    </div>
    );
  }
  
  export default App;
  