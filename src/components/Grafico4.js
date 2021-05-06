import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Line } from 'react-chartjs-2';
import './Grafico2.css'


const Grafico4 = (props) => {

    useEffect(() => {
    });

    return(
        <div>
            <h1>Sensor1: {props.co2} </h1>
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
                data={props.chartData}
             />
        </div>
    );
};

export default Grafico4;