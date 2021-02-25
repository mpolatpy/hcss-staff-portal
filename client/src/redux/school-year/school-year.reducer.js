import { SchoolYearActionTypes } from './school-year.types';

const INITIAL_STATE = {
    currentYear: null
};

const yearReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SchoolYearActionTypes.SET_CURRENT_YEAR:
            return {
                ...state,
                currentYear: action.payload
            }
        default:
            return state
    }
}

export default yearReducer;