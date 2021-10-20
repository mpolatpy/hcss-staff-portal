import TeacherActionTypes from './teachers.types';
import { firestore, convertCollectionSnapshotDataToMap } from '../../firebase/firebase.utils';

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

export const fetchTeachersAsync = (uid) => {

    return async dispatch => {

        dispatch(fetchTeachersStart());

        try {
            const collectionRef = firestore.collection('users');
            const snapshot = await collectionRef.get();
            let teachersMap = convertCollectionSnapshotDataToMap(snapshot);
            const staff = teachersMap[uid];

            if( staff && staff.role === 'teacher'){
                teachersMap = { [uid]: staff }
            }

            dispatch(fetchTeachersSuccess(teachersMap));
        } catch (e) {
            dispatch(fetchTeachersFailure(e.message))
        }
    }
};

export const resetTeachers = () => ({
    type: TeacherActionTypes.RESET_TEACHERS,
});


