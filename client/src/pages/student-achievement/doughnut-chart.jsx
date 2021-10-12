import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getTargetAndSlgData } from './student-achievement-utils';

const DoughnutChart = ({ records, header }) => {
    const labels = ['E', 'M', 'PM', 'NM'];
    const { targetData, slgData } = getTargetAndSlgData(records, header)
    let targetCount = labels.reduce((acc, curr) => acc + (parseInt(targetData[curr]) || 0), 0);

    // let slgCount = labels.reduce((acc, curr) => acc + (slgData[curr] || 0));
    const targetDataToDisplay = labels.map(label => {
        const val = (targetData[label] / targetCount * 100).toFixed(1);
        if(isNaN(val)){
            return '';
        }
        return val;
    });
    // const slgDataToDisplay = labels.map(label => (slgData[label] / slgCount * 100).toFixed(1));
    const meetingOrExcceding = (parseFloat(targetDataToDisplay[0]) || 0) + (parseFloat(targetDataToDisplay[1]) || 0);

    const dataForTarget = {
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: targetDataToDisplay,
                datalabels: {
                    color: '#36A2EB',
                    formatter: function (value, context){
                        // const index = context.dataIndex;
                        if(value === ''){
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
        <div style={{ width: '25vw', marginTop: '20px' }}>
            <Doughnut data={dataForTarget} plugins={[ChartDataLabels]} />
            <h4>{`Meeting or Exceeding: ${meetingOrExcceding.toFixed(1)} %`}</h4>
        </div>
    );
}

export default DoughnutChart;