import SavedObservationsActionTypes from './saved-observations.types';

const INITIAL_STATE = {
    isLoading: false,
    observations: null,
    errorMessage: undefined
};

const savedObservationsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SavedObservationsActionTypes.FETCH_SAVED_OBSERVATIONS_START:
            return {
                ...state,
                isLoading: true,
            };
        case SavedObservationsActionTypes.FETCH_SAVED_OBSERVATIONS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                observations: action.payload
            };
        case SavedObservationsActionTypes.FETCH_SAVED_OBSERVATIONS_FAIL:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload
            };
        case SavedObservationsActionTypes.RESET_SAVED_OBSERVATIONS:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default savedObservationsReducer;