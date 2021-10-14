import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const DoughnutChart = ({ data }) => {
    const labels = ['E', 'M', 'PM', 'NM'];

    let targetCount = data.valueCounts;
    const meetingOrExcceding = ((data['E'] + data['M']) * 100 / targetCount ).toFixed(1);

    const targetDataToDisplay = labels.map(label => {
        const val = (data[label] * 100 / targetCount).toFixed(1);
        if(isNaN(val) || data[label] === 0){
            return '';
        }
        return val;
    });

    const dataForTarget = {
        labels: labels,
        datasets: [
            {
                label: 'SLG Ratings',
                data: targetDataToDisplay,
                datalabels: {
                    color: '#36A2EB',
                    formatter: function (value, context){
                        // const index = context.dataIndex;
                        if(value === '' || value === 0){
                            return '';
                        }
                        return `${value} %`;
                    }
                },
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ width: '23vw', marginTop: '20px' }}>
            <Doughnut data={dataForTarget} plugins={[ChartDataLabels]} />
            <h4>{`Meeting or Exceeding: ${meetingOrExcceding} %`}</h4>
        </div>
    );
}

export default DoughnutChart;