import React from 'react';
import { connect } from 'react-redux';

import { selectTeacher } from '../../redux/teachers/teachers.selectors';
import CustomCard from '../../components/custom-card/custom-card.component';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    card: {
        minWidth: '400px',
        padding: theme.spacing(2)
    }
}));

const TeacherDetails = ({teacher} ) => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <Typography variant="h6">{`Page for ${teacher.firstName} ${teacher.lastName}`}</Typography>
            <Divider/>
            <div className={classes.card}>
                <CustomCard
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/sciencelab2-420x420.jpg"
                    title='Observations'
                    header="Observations"
                    buttonText="View My Observations"
                    to="/observations"
                >
                    <Typography>View observations here</Typography>
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2019/12/science-lab.jpg"
                    title='Observations'
                    header="Grade Policy"
                    // buttonText="View My Observations"
                    to="/observations"
                >
                    <Typography>View observations here</Typography>
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2019/12/circles-HAMPDEN-1.png"
                    title='Observations'
                    header="Student Achievement"
                    // buttonText="View My Observations"
                    to="/observations"
                >
                    <p>View observations here</p>
                </CustomCard>
            </div>
            <div className={classes.card}>
                <CustomCard
                    className={classes.card}
                    imageUrl="https://east.hampdencharter.org/wp-content/uploads/2018/03/music-3-420x420.jpg"
                    title='Observations'
                    header="Tutoring"
                    // buttonText="View My Observations"
                    to="/observations"
                >
                    <p>View observations here</p>
                </CustomCard>
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
})

export default connect(mapStateToProps)(TeacherDetails);