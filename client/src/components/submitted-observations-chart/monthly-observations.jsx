import React from 'react';
import { Bar } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import VerticalTabs from '../vertical-tabs/vertical-tabs-component';

const MonthlyObservationsChart = ({ observationsByMonth }) => {
    const months = ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const labels = observationsByMonth && months.filter(month => Object.keys(observationsByMonth).includes(month));
    const options = {
        indexAxis: 'y',
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

    const contents = observationsByMonth && labels.map(month => {
        const observations = observationsByMonth[month];

        if (!observations) return null;

        const { count, observationCountByTeacher } = observations;

        return (
            <div style={{ width: '68vw' }}>
                <Bar
                    data={{
                        labels: observationCountByTeacher && Object.keys(observationCountByTeacher),
                        datasets: [
                            {
                                label: month,
                                data: observationCountByTeacher ? (
                                    Object.keys(observationCountByTeacher)
                                        .map(teacher => observationCountByTeacher[teacher])
                                ) : [],
                                backgroundColor: 'rgb(54, 162, 235)',
                                borderWidth: 1,
                            }
                        ],
                    }}
                    options={options}
                />
                <Typography variant="caption">{`Total: ${count}`}</Typography>
            </div>
        )
    });

    return (
        observationsByMonth && (
            <VerticalTabs labels={labels} contents={contents} />
        )
    );
};

export default MonthlyObservationsChart;