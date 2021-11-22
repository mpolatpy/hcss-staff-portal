import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeacher } from '../../redux/teachers/teachers.selectors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import ObservationAccordion from './observation-accordion';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
}));

const TeacherObservationsComponent = ({ teacher, currentYear }) => {
    const classes = useStyles();
    const [evaluations, setEvaluations] = useState(null);

    const observationTypes = [
        "weeklyObservationScores",
        "fullClassObservationScores",
    ];

    useEffect(() => {

    },[]);

    return (
        <>
            <Typography variant="h6">Observation Feedback</Typography>
            <Divider />

            <div>
                <div className={classes.root}>
                    {
                        observationTypes.map((observationType, index) => {
                            console.log(observationType)
                            return (
                                <ObservationAccordion
                                    key={observationType}
                                    teacher={teacher}
                                    index={index}
                                    observationType={observationType}
                                    currentYear={currentYear}
                                />
                            )
                        })
                    }
                </div>
            </div>

        </>
    )

}

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
    currentYear: selectCurrentYear(state)
});

export default connect(mapStateToProps)(TeacherObservationsComponent);