import React from 'react';

import CustomCard from '../../components/custom-card/custom-card.component';
import { makeStyles } from '@material-ui/core/styles';

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

const TeacherHomeComponent = ({teacher}) => {
    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <div className={classes.card}>
                <CustomCard
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/sciencelab2-420x420.jpg"
                    title='Observations'
                    header="Observations"
                    buttonText="View Observations"
                    to={`/staff/observations/${teacher.id}`}
                >
                    {/* <Typography>View observations here</Typography> */}
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/music-3-420x420.jpg"
                    title='Lesson Plans'
                    header="Lesson Plans"
                    buttonText="View Lesson Plans"
                    to={`/staff/lesson-plans/${teacher.id}`}
                >
                    {/* <p>View observations here</p> */}
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
        </div>
    )
}


export default TeacherHomeComponent;