import ObservationFormActionTypes from './observation-form.types';

export const INITIAL_STATE = {
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
        partOfTheClass: '',
        section: ''
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
    evaluationScores: {
        overallScore: 0,
        domainOneScore: 0,
        domainTwoScore: 0,
        domainThreeScore: 0,
        domainFourScore: 0,
        studentAchievement: 0
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
                    course: action.payload.observationDetails.course,
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
        case ObservationFormActionTypes.SET_EVALUATION_SCORE:
            return {
                ...state,
                evaluationScores: action.payload
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
                    message: action.payload
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
        case ObservationFormActionTypes.SET_SUBMISSION_MESSAGE:
            return {
                ...state,
                submissionMessage: {
                    status: action.payload.status,
                    message: action.payload.content
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