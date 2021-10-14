import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BarChart = ({ data }) => {
    const labels = ['E', 'M', 'PM', 'NM'];

    const targetDataToDisplay = labels.map(label => data[label]);

    const chartData = {
        labels: [
            'Exceeding Expectations',
            'Meeting Expectations',
            'Partially Meeting Expectations',
            'Not Meeting Expectations'
        ],
        
        datasets: [
            {
                label: 'Target Ratings',
                data: targetDataToDisplay,
                datalabels: {
                    color: '#36A2EB',
                    anchor: 'end',
                    align: 'end'
                },
                backgroundColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    return (
        <div style={{
            width: '55vw',
            marginTop: '20px'
        }}>
            <Bar data={chartData} plugins={[ChartDataLabels]} options={options} />
        </div>
    )
};

export default BarChart;