import Typography from "@material-ui/core/Typography";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const TestResultCounts = ({ results, ratingIndex }) => {
    const ratings = {
        'E': 'Exceeding Expectaions',
        'M': 'Meeting Expectaions',
        'PM': 'Partially Meeting Expectaions',
        'NM': 'Not Meeting Expectaions'
    };

    const labels = ['E', 'M', 'PM', 'NM'];

    const counts = { 'E': 0, 'M': 0, 'PM': 0, 'NM': 0 };

    if (!results || results.length === 0) return null;

    for (let row of results) {
        const rating = row[ratingIndex];
        if (rating in counts) {
            counts[rating]++;
        }
    }

    const data = {
        labels: [
            'Exceeding Expectations',
            'Meeting Expectations',
            'Partially Meeting Expectations',
            'Not Meeting Expectations'
        ],
        
        datasets: [
            {
                label: '# of Students by Performance Rating',
                data: labels.map(label => counts[label]),
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
        // <div>
        //     {
        //         ['E', 'M', 'PM', 'NM'].map(rating => (
        //             <div>
        //                 <Typography variant="caption"><strong>{ratings[rating]}</strong> : {counts[rating]}</Typography>
        //             </div>
        //         ))
        //     }
        // </div>
        <div style={{
            width: '55vw',
            margin: '10px 0 20px'
        }}>
            <Bar data={data} plugins={[ChartDataLabels]} options={options} />
        </div>
    )
};

export default TestResultCounts;