import React from 'react';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import CustomCard from '../../components/custom-card/custom-card.component';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';

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

const TeacherHomeComponent = ({ teacher, currentUser }) => {
    const classes = useStyles();

    return (
        <>
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
                        to={`/staff/grading-feedback/${teacher.id}`}
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
            {
                currentUser?.role === 'superadmin' && (
                    <div>
                        <Button
                            component={Link}
                            to={`/staff/edit-info?teacherId=${teacher.id}`}
                            color='primary'
                        >
                            <EditIcon />
                            <span style={{ marginLeft: '5px' }}>Edit Staff Information</span>
                        </Button>
                    </div>
                )
            }
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
})

export default connect(mapStateToProps)(TeacherHomeComponent);