import TeacherActionTypes from './teachers.types';

const INITIAL_STATE = {
    isLoading: false,
    teachers: null,
    errorMessage: undefined
};

const teachersReducer = (state=INITIAL_STATE, action) => {
    switch (action.type){
        case TeacherActionTypes.FETCH_TEACHERS_START:
            return {
                ...state,
                isLoading: true,
            };
        case TeacherActionTypes.FETCH_TEACHERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                teachers: action.payload
            };
        case TeacherActionTypes.FETCH_TEACHERS_FAILURE:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload
            };
        case TeacherActionTypes.RESET_TEACHERS:
            return {
                ...state,
                teachers: null
            };
        default:
            return state;
    }
};

export default teachersReducer;
