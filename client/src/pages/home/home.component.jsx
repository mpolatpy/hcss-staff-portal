import React from 'react';
// import firebase, { auth } from '../../firebase/firebase.utils';
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
        padding: theme.spacing(1),
    },
    banner: {
        background: 'lightblue',
        padding: theme.spacing(2),
        width: '100%',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
}));
const HomePage = ({ currentUser }) => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.banner}>
                Welcome to the Dashboard!
            </div>
            <div className={classes.cardContainer}>
                {/* Announcements: */}
            </div>
        </div>
    );
};

export default HomePage;

const HomePage = ({currentUser}) => {
    const classes = useStyles();
    
    return (
        <div className={classes.cardContainer}>
            <div className={classes.card}>
                <CustomCard
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/sciencelab2-420x420.jpg"
                    title='Observations'
                    header="Observations"
                    buttonText="View Observations"
                    to="/observations"
                >
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/music-3-420x420.jpg"
                    title='Lesson Plans'
                    header="Lesson Plans"
                    buttonText="View Lesson Plans"
                    to="/lesson-plans"
                >
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2019/12/circles-HAMPDEN-1.png"
                    title='Parent Communications'
                    header="Parent Communication"
                    buttonText="View Parent Communications"
                    to="/parent-communication"
                >
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2019/12/science-lab.jpg"
                    title='Grade Policy'
                    header="Grade Policy"
                    buttonText="View Grade Policy"
                    to="/grade-policy"
                >
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://hampdencharter.org/wp-content/uploads/2019/11/ACH3.jpg"
                    title='Student Achievement'
                    header="Student Achievement"
                    buttonText="View Student Achievement"
                    to="/student-achievement"
                >
                    {/* <Typography>View observations here</Typography> */}
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://hampdencharter.org/wp-content/uploads/2019/11/music1.jpg"
                    title='Attendance Records'
                    header="Attendance"
                    buttonText="View Attendance Records"
                    to={`/staff/attendance/${currentUser.id}`}
                >
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://west.hampdencharter.org/wp-content/uploads/2018/03/LAB1-895x430-copy-895x430.jpg"
                    title='Tutoring'
                    header="Tutoring"
                    buttonText="View Tutoring Records"
                    to={`/staff/tutoring`}
                >
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://west.hampdencharter.org/wp-content/uploads/2018/03/ROBOT1-895x430.jpg"
                    title='Test Results'
                    header="Test Results"
                    buttonText="View Test Results"
                    to={`/test-results`}
                >
                </CustomCard>
            </div>
            
            {/* https://hampdencharter.org/wp-content/uploads/2019/11/music1.jpg
            https://west.hampdencharter.org/wp-content/uploads/2018/03/ART1-895x430.jpg
            https://west.hampdencharter.org/wp-content/uploads/2018/03/ROBOT1-895x430.jpg
            https://west.hampdencharter.org/wp-content/uploads/2018/03/LAB1-895x430-copy-895x430.jpg */}
        </div>
    )
}


export default HomePage;
