import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { firestore } from '../../firebase/firebase.utils';
import { selectTeachers } from "../../redux/teachers/teachers.selectors";
import { selectCurrentYear } from "../../redux/school-year/school-year.selectors";

import ObservationChartByType from "../../components/observation-chart-by-type/observation-chart-by-type.component";
import ObservationTableByType from "../../components/observation-table-by-type/observation-table-by-type.component";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';

const SubmittedObservationDetails = (props) => {
    const { match, observationType, currentYear, teachers } = props;
    const [state, setState] = useState({
        observations: [],
        score: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const teacherId = match.params.teacherId;
    const teacher = teachers ? teachers[teacherId] : null;

    useEffect(() => {
        const observationTypeMap = {
            'Weekly Observation': 'weeklyObservationScores',
            'Full Class Observation': 'fullClassObservationScores',
            'Quarter Evaluation': 'quarterScores',
            'Midyear Evaluation': 'midyearScores',
            'End of Year Evaluation': 'endOfYearScores'
        };

        const scoreType = observationTypeMap[observationType]

        const fetchInitialObservationData = async () => {
            try {
                setIsLoading(true);

                const scoreRef = firestore.doc(`observationScores/${currentYear}/${scoreType}/${teacherId}`);
                const observationsRef = firestore.collection('observations')
                    .where('teacherid', '==', teacherId)
                    .where('observationDetails.schoolYear', '==', currentYear)
                    .where('observationType', '==', observationType)
                    .orderBy('observationDate', 'desc')

                const snapshot = await observationsRef.get();
                const fetchedObservations = snapshot.docs.map(doc => doc.data());
                const scoreSnapshot = await scoreRef.get();
                const score = scoreSnapshot.data();

                setState({
                    observations: fetchedObservations,
                    score: score,
                });
                setIsLoading(false);

            } catch (e) {
                console.log(e.message);
            }
        }

        fetchInitialObservationData();
    }, [teacherId, currentYear, observationType]);

    return (
        <div>
            {
                isLoading ? (<CircularProgress />) : (
                    teacher && (
                        <>
                            <Typography variant="h5"> {`${observationType}s - ${teacher.firstName} ${teacher.lastName}`}</Typography>
                            <ObservationChartByType score={state.score} />
                            <ObservationTableByType observations={state.observations} />
                        </>
                    )
                )
            }
        </div>
    );

};

const mapStateToProps = createStructuredSelector({
    currentYear: selectCurrentYear,
    teachers: selectTeachers
});

export default connect(mapStateToProps)(withRouter(SubmittedObservationDetails));
