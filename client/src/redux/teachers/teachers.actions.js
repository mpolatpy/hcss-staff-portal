import TeacherActionTypes from './teachers.types';
import { firestore, convertTeacherSnapshotToMap } from '../../firebase/firebase.utils';

const fetchTeachersStart = () => ({
    type: TeacherActionTypes.FETCH_TEACHERS_START
});

const fetchTeachersSuccess = (teachers) => ({
    type: TeacherActionTypes.FETCH_TEACHERS_SUCCESS,
    payload: teachers
});

const fetchTeachersFailure = (errorMessage) => ({
    type: TeacherActionTypes.FETCH_TEACHERS_FAILURE,
    payload: errorMessage
});

export const fetchTeachersAsync = () => {
    return dispatch => {
        const collectionRef = firestore.collection('users');
        dispatch(fetchTeachersStart());

        collectionRef
            .get()
            .then( snapshot => {
                const teachersMap = convertTeacherSnapshotToMap(snapshot);
                dispatch(fetchTeachersSuccess(teachersMap))
            }) 
            .catch(err => dispatch(fetchTeachersFailure(err.message)))
    }
};


