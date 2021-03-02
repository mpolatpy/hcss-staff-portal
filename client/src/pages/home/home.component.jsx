import React from 'react';

import CustomCard from '../../components/custom-card/custom-card.component';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    card: {
        minWidth: '300px',
        padding: theme.spacing(2)
    }
}));

const HomePage = () => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <div className={classes.card}>
                <CustomCard
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/sciencelab2-420x420.jpg"
                    title='Observations'
                    header="Observations"
                    buttonText="View My Observations"
                    to="/observations"
                >
                    {/* <Typography>View observations here</Typography> */}
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2019/12/science-lab.jpg"
                    title='Grade Policy'
                    header="Grade Policy"
                    buttonText="View Grade Policy"
                    to="#"
                >
                    {/* <Typography>View observations here</Typography> */}
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2019/12/circles-HAMPDEN-1.png"
                    title='Observations'
                    header="Student Achievement"
                    buttonText="View Student Achievement"
                    to="#"
                >
                    {/* <p>View observations here</p> */}
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/music-3-420x420.jpg"
                    title='Observations'
                    header="Tutoring"
                    buttonText="View Tutoring Data"
                    to="#"
                >
                    {/* <p>View observations here</p> */}
                </CustomCard>
            </div>
        </div>
    )
}


export default HomePage;