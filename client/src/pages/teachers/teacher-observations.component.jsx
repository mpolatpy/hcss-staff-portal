import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestore } from '../../firebase/firebase.utils';
import ObservationTableByType from '../../components/observation-table-by-type/observation-table-by-type.component';
import { selectTeacher } from "../../redux/teachers/teachers.selectors";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';

const TeacherObservationsDetailPage = ({observationType, teacher, currentYear}) => {

    const teacherId = teacher.id;
    const [observations, setObservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInitialObservationData = async () => {  
            try{
                const observationsRef = firestore.collection('observations')
                    .where('teacherid', '==', teacherId)
                    .where('observationDetails.schoolYear', '==', currentYear)
                    .where('observationType', '==', observationType )
                    .orderBy('observationDate', 'desc')

                const snapshot = await observationsRef.get();
                const fetchedObservations = snapshot.docs.map(doc => doc.data());

                setObservations(fetchedObservations);

            } catch(e){
                console.log(e.message);
            }
        }
        setIsLoading(true);
        fetchInitialObservationData();
        setIsLoading(false);
    },[teacherId, currentYear, observationType]);

    return ( 
        <div>
            {
            isLoading ? (<CircularProgress />) : (
                <>
                <Typography variant="h5"> {`${observationType}s - ${teacher.firstName} ${teacher.lastName}`}</Typography>
                <ObservationTableByType observations={observations} />
                </>
            )
            }
        </div>
    );

};

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
});

export default connect(mapStateToProps)(TeacherObservationsDetailPage);


