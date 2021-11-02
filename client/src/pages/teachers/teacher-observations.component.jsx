import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestore } from '../../firebase/firebase.utils';
import ObservationTableByType from '../../components/observation-table-by-type/observation-table-by-type.component';
import { selectTeacher, selectTeacherOptions, selectTeachersObjWithNameKeys } from "../../redux/teachers/teachers.selectors";
import { selectCurrentUser } from '../../redux/user/user.selectors';
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import CustomSelect from '../../components/custom-select/custom-select.component';

const TeacherObservationsDetailPage = ({observationType, teacher, currentUser, currentYear, history, match, teachersOptions, teachersMap}) => {

    const teacherId = teacher ? teacher.id : null;
    const [observations, setObservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInitialObservationData = async () => {  
            if(!teacher) return;
            setIsLoading(true);
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
            setIsLoading(false);
        }
        
        fetchInitialObservationData();
        
    },[teacherId, currentYear, observationType]);

    const handleSelect = (e) => {
        const {value} = e.target;
        const {id} = teachersMap[value];
        history.push(match.url.replace(match.params.teacherId, id));
    };

    return ( 
        <div>
            {
            isLoading ? (<CircularProgress />) : (
                <>
                <Box
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <Typography variant="h5"> {`${observationType}s`}</Typography>
                    {
                        currentUser && currentUser.role !== 'teacher' && (
                            <CustomSelect
                                label="Selected Teacher"
                                style={{ width: 100, height: 40 }}
                                options={teachersOptions}
                                name="selectTeacher"
                                value={teacher ? `${teacher.lastName}, ${teacher.firstName}` : ''}
                                handleSelect={handleSelect}
                            />
                        )
                     }
                </Box>
                <ObservationTableByType observations={observations} />
                </>
            )
            }
        </div>
    );

};

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
    teachersOptions: selectTeacherOptions(state),
    teachersMap: selectTeachersObjWithNameKeys(state),
    currentUser: selectCurrentUser(state)
});

export default connect(mapStateToProps)(TeacherObservationsDetailPage);


