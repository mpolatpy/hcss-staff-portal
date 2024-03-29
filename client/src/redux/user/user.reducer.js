import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
    currentUser: null,
    schoolPreference: null,
    departmentPreference: null,
    activeTeacherPreference: true
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        case UserActionTypes.SET_SCHOOL_PREFERENCE:
            return {
                ...state,
                schoolPreference: action.payload
            }
        case UserActionTypes.SET_DEPARTMENT_PREFERENCE:
            return {
                ...state,
                departmentPreference: action.payload
            }
        case UserActionTypes.SET_ACTIVE_TEACHER_PREFERENCE:
            return {
                ...state,
                activeTeacherPreference: action.payload
            }
        default:
            return state
    }
}

export default userReducer;