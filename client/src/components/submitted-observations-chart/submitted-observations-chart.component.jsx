import React from 'react';
import { Bar } from 'react-chartjs-2';

const SubmittedObservationsChart = ({observations}) => {

    const observationTypes =  [
        {
            type: 'Weekly Observation',
            color: 'rgb(255, 99, 132)',
            stack: 'stack1'
        }, 
        {
            type: 'Full Class Observation',
            color: 'rgb(54, 162, 235)',
            stack: 'stack1'
        }, 
        {
            type: 'Quarter Evaluation',
            color: 'rgb(75, 192, 192)',
            stack: 'stack1'
        }, 
        {
            type: 'Midyear Evaluation',
            color: 'rgba(255, 205, 86)',
            stack: 'stack1'
        },  
        {
            type: 'End of Year Evaluation',
            color: 'rgba(75, 192, 192, 0.2)',
            stack: 'stack1'
        },  
        
    ];

    const data = {
        labels: observations.map( observation => `${observation.teacher.firstName} ${observation.teacher.lastName}`),
        datasets: observationTypes.map( ({type, color, stack}) => {
            const data = observations.map(observation => observation[type]);
            return {
                label: type,
                data: data,
                // barThickness: 30,
                // categoryPercentage: 0.8,
                stack: stack,
                backgroundColor: color
            };
        })
    }

    const options = {
        indexAxis: 'y',
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            { 
                stacked: true, 
            },
          ],
        },
      };

    return ( 
        <div style={{ marginTop: '20px' }}>
            <Bar 
            data={data} 
            options={options}
             />
        </div>
    );
};

export default SubmittedObservationsChart;