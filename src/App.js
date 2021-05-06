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
        array1: [],
        array2: []
    })


    useEffect(() => {
        const getData = () => {
            console.log("array1", datos.array1)
            console.log("array2", datos.array2)

            setData({
                labels: [1,2,3,4,5,6,7,8,9,10],
                datasets: [
                    {
                        label: 'CO2 (ppm)',
                        data: datos.array1,
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
                        data: datos.array2,
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

        const handleJsonMessage = (json) => {
            //setState({...json})
            setState(json["co2"])
            const newField = json["co2"]
            // setDatos(datos.data.push(newField))

            let myArrayCopy = datos.array1.slice()
            if (myArrayCopy.length < 10)
                myArrayCopy.push(newField)
            else {
                for (var i = 0; i < 9; i++) {
                    myArrayCopy[i] = myArrayCopy[i+1]
                }
                myArrayCopy[9] = newField
            }

            let myArrayCopy2 = datos.array2.slice()
            if (myArrayCopy2.length < 10)
                myArrayCopy2.push(newField+20)
            else {
                for (var i = 0; i < 9; i++) {
                    myArrayCopy2[i] = myArrayCopy2[i+1]
                }
                myArrayCopy2[9] = newField+20
            }
            setDatos({
                array1: myArrayCopy,
                array2 : myArrayCopy2
            })
            getData()
        }

        getData();
        let client = mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt')
        client.on("connect", () => {
            console.log("Connected");
            client.subscribe("/tfg/react/chart/co2");
        });

        client.on("message", (topic, message) => {
            console.log(JSON.parse(message.toString()))
            handleJsonMessage(JSON.parse(message.toString()));     
         });

    
        return () => client.end();
    }, [datos.array1]);
  
  //<Grafico3 chartData={data} co2={6344}/>
  return (
    <div className="App">
        <Grafico4 chartData={data} co2={state}/>
    </div>
    );
  }
  
  export default App;
  