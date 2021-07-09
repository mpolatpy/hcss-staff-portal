import { Bar } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';

const ObservationChartByType = ({score}) => {

    const domainMap = {
        'Domain One': 'domainOne',
        'Domain Two': 'domainTwo',
        'DomainThree': 'domainThree',
        'DomainFour': 'domainFour'
    };
    
    const labels = Object.keys(domainMap);
    const scores = score ? Object.values(domainMap).map ( domain => score[domain].score ) : [];
    const numScores = score ? Object.values(domainMap).map ( domain => score[domain].numScores ) : [];

    const backgroundColor = [
        'rgba(255, 99, 132)',
        'rgba(54, 162, 235)',
        'rgba(255, 206, 86)',
        'rgba(75, 192, 192)',
    ];
    const borderColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
    ];

    const data1 = {
        labels: labels,
        datasets: [{
            label: 'Domain Average',
            data: scores,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
        }]
    };

    const data2 = {
        labels: labels,
        datasets: [{
            label: '# of Observations',
            data: numScores,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
        }] 
    };

    const options = {
        // responsive: true,
        maintainAspectRatio: false,
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
        <Grid container >
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} md={8} lg={8} justifyContent="center" alignItems="center">
                    <Bar data={data1} options={options}/>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <Bar data={data2} options={options}/>
                </Grid>
            </Grid>
        </Grid>

        // <div>
        //     <div style={{ width: '80vw', height: '200px' }}>
        //         <Bar data={data1} options={options}/>
        //     </div>
        //     <div style={{ width: '80vw', height: '200px' }}>
        //         <Bar data={data2} options={options}/>
        //     </div>
        // </div>
    );

};

export default ObservationChartByType;