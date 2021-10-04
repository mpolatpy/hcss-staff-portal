import React from 'react';
import { Bar } from 'react-chartjs-2';

const StudentAchievementBar = ({ records, header }) => {
    const labels = ['E', 'M', 'PM', 'NM'];
    const idx1 = header.indexOf('Target Rating');
    const idx2 = header.indexOf('SLG Rating');
    const targetData = {}, slgData = {};

    records.forEach(record => {
        const targetRating = record[idx1];
        const slgRating = record[idx2];
        targetData[targetRating] = (targetData[targetRating] || 0) + 1;
        slgData[slgRating] = (slgData[slgRating] || 0) + 1;
    });

    const targetDataToDisplay = labels.map(label => targetData[label]);
    const slgDataToDisplay = labels.map(label => slgData[label]);

    const data = {
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
                backgroundColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            },
            {
                label: 'SLG Ratings',
                data: slgDataToDisplay,
                backgroundColor: 'rgba(255, 205, 86)',
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
            width: '55%', 
            marginTop: '20px'
            }}>
            <Bar data={data} options={options} />
        </div>
    )
};

export default StudentAchievementBar;