import { useEffect, useState} from 'react';

import Typography from '@material-ui/core/Typography';
import { CircularProgress } from '@material-ui/core';
import LessonPlanTable from '../../components/lesson-plan-content/lesson-plan-table';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeachers } from '../../redux/teachers/teachers.selectors';

const SubmittedLessonPlans = ({currentUser, currentYear, teachers}) => {

    const [lessonPlanSummary, setLessonPlanSummary] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSelectedTeachers = async () => {
            const ref = firestore.doc(`observationTemplates/${currentUser.id}`);
            const snapshot = await ref.get();
            let selectedTeachers = [];

            if (snapshot.exists){
                const fetchedData = snapshot.data();
                if(Object.keys(fetchedData).includes('teachers')){
                    selectedTeachers = fetchedData.teachers.map(teacher => teacher.id);
                }
            }

            return selectedTeachers;
        };

        const fetchLessonPlanSummary = async (selectedTeachers) => {
            let fetchedLessonPlanSummary = [];

            let i = 0;

            while (i < selectedTeachers.length){
                const ref = firestore.collection(`lessonPlanScores/${currentYear}/summary`)
                            .where('teacherId', 'in', selectedTeachers.slice(i, i+10) )
                const snapshot = await ref.get();

                if(!snapshot.empty){
                    snapshot.docs.forEach(doc => (
                        fetchedLessonPlanSummary.push( doc.data())
                    ));
                }

                i += 10;
            }

            setLessonPlanSummary(fetchedLessonPlanSummary);
        };

        setIsLoading(true);
        fetchSelectedTeachers().then( selectedTeachers=>  fetchLessonPlanSummary(selectedTeachers));
        setIsLoading(false);
    }, [currentUser, currentYear]);

    return (
        <div>
            <Typography variant="h5">Lesson Plans - Overview</Typography>
            {
            isLoading ? (
                <CircularProgress />
            ) : (
                <LessonPlanTable 
                teachers={teachers}
                lessonPlanSummary={lessonPlanSummary}
                />
            )}  
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    teachers: selectTeachers
});

export default connect(mapStateToProps)(SubmittedLessonPlans);