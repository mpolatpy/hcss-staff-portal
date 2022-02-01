import { useEffect, useState } from 'react';
import { firestore } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeacher } from '../../redux/teachers/teachers.selectors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ObservationAccordion from './observation-accordion';
import EvaluationCard from './evaluation-card';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
}));

const TeacherObservationsComponent = ({ teacher, currentYear }) => {
    const classes = useStyles();
    const [midYearEvaluation, setMidyearEvaluation] = useState(null);
    const [finalEvaluation, setFinalEvaluation] = useState(null);

    const observationTypes = [
        "weeklyObservationScores",
        "fullClassObservationScores",
    ];

    useEffect(() => {
        const getEvaluationData = async () => {
            if(!teacher){
                return;
            }
            const ref = firestore.collection('observations')
                .where('teacherid', '==', teacher.id)
                .where('observationDetails.schoolYear', '==', currentYear)
                .where('observationType', 'in', ['Midyear Evaluation', 'End of Year Evaluation'])
                .where('observationDetails.observer.role', '==', 'superadmin');
            
            const snapshot = await ref.get();
            const evaluations = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            let midYearEvaluation = evaluations.find(x => x.observationType === 'Midyear Evaluation');
            let finalEvaluation = evaluations.find(x => x.observationType === 'End of Year Evaluation');
            setMidyearEvaluation(midYearEvaluation);
            setFinalEvaluation(finalEvaluation);
        };

        getEvaluationData();

    },[teacher, currentYear]);

    return (
        <>
            <Typography variant="h6">Observation Feedback</Typography>
            <Divider />

            <div>
                <div className={classes.root}>
                    {
                        observationTypes.map((observationType, index) => {
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
                    {
                        finalEvaluation && (
                            <EvaluationCard 
                                type='End of Year Evaluation'
                                evaluation={finalEvaluation}
                            />
                        )
                    }
                    {
                        midYearEvaluation && (
                            <EvaluationCard 
                                type='Midyear Evaluation'
                                evaluation={midYearEvaluation}
                            />
                        )
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