import ObservationFormActionTypes from './observation-form.types';

const INITIAL_STATE = {
    isSavedObservation: false,
    isSubmitting: false,
    submissionMessage: {
        status: null,
        message: ""
    },
    observationDetails: {
        observationDate: null,
        observationType: '',
        schoolYear: '',
        observer: null,
        teacher:null,
        school:'',
        department: '',
        block: '',
        course: '',
        partOfTheClass: ''
    },
    domainOne: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0
    },
    domainTwo: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
    },
    domainThree: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
    },
    domainFour: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0
    },
    observationNotes: ''
};

const observationFormReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case ObservationFormActionTypes.SET_OBSERVATION_FORM:
            return {
                ...action.payload,
                isSubmitting: false,
                submissionMessage: {
                    status: null,
                    message: ""
                },
                observationDetails: {
                    ...action.payload.observationDetails,
                    observationDate: (
                        action.payload.observationDetails.observationDate?
                        new Date(action.payload.observationDetails.observationDate.seconds*1000):
                        null
                        ) 
                }
            };
        case ObservationFormActionTypes.SET_OBSERVATION_DETAILS:
            return {
                ...state,
                observationDetails: action.payload
            };
        case ObservationFormActionTypes.SET_STANDARD_ONE:
            return {
                ...state,
                domainOne: action.payload
            };
        case ObservationFormActionTypes.SET_STANDARD_TWO:
            return {
                ...state,
                domainTwo: action.payload
            };
        case ObservationFormActionTypes.SET_STANDARD_THREE:
            return {
                ...state,
                domainThree: action.payload
            };
        case ObservationFormActionTypes.SET_STANDARD_FOUR:
            return {
                ...state,
                domainFour: action.payload
            };
        case ObservationFormActionTypes.SET_OBSERVATION_NOTES:
            return {
                ...state,
                observationNotes: action.payload
            };
        case ObservationFormActionTypes.SUBMIT_OBSERVATION_FORM_START:
            return {
                ...state,
                isSubmitting: true
            };
        case ObservationFormActionTypes.SUBMIT_OBSERVATION_FORM_SUCCES:
            return {
                ...INITIAL_STATE,
                isSubmitting: false,
                submissionMessage: {
                    status: 'success',
                    message: 'Successfully submitted/saved observation form'
                }
            };
        case ObservationFormActionTypes.SUBMIT_OBSERVATION_FORM_FAIL:
            return {
                ...state,
                isSubmitting: false,
                submissionMessage: {
                    status: 'error',
                    message: action.payload
                }
            };
        case ObservationFormActionTypes.DELETE_OBSERVATION_FORM_START:
            return {
                ...state,
                isSubmitting: true
            };
        case ObservationFormActionTypes.DELETE_OBSERVATION_FORM_SUCCESS:
            return {
                ...INITIAL_STATE,
                isSubmitting: false,
                submissionMessage: {
                    status: 'success',
                    message: 'Successfully deleted observation form'
                }
            };
        case ObservationFormActionTypes.DELETE_OBSERVATION_FORM_FAIL:
            return {
                ...state,
                isSubmitting: false,
                submissionMessage: {
                    status: 'error',
                    message: action.payload
                }
            };
        case ObservationFormActionTypes.RESET_SUBMISSION_MESSAGE:
            return {
                ...state,
                submissionMessage: {
                    status: '',
                    message: ''
                }
            };
        case ObservationFormActionTypes.RESET_OBSERVATION_FORM:
            return {
                ...INITIAL_STATE,
                observationDetails: {
                    ...INITIAL_STATE.observationDetails,
                    schoolYear: action.payload.schoolYear,
                    observer: action.payload.observer
                }
            };
        default:
            return state;
    }
}

export default observationFormReducer;