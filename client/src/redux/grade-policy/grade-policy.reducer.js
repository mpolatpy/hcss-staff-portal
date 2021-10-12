import GradePolicyActionTypes from "./grade-policy.types";

const INITIAL_STATE = {
    isLoading: false,
    teachers: [],
    gradePolicyChecks: null,
    errorMessage: undefined
};

const gradePolicyChecksReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GradePolicyActionTypes.SET_GRADE_POLICY_CHECKS_START:
            return {
                ...state,
                isLoading: true
            };
        case GradePolicyActionTypes.SET_GRADE_POLICY_CHECKS_SUCCESS:
            return {
                ...state,
                teachers: [...state.teachers, ...action.payload.teachers],
                gradePolicyChecks: action.payload.initialData,
                isLoading: false
            };
        case GradePolicyActionTypes.SET_GRADE_POLICY_CHECKS_FAIL:
            return {
                ...state,
                isLoading: false,
                errorMessage: "An error occurred! Please try again."
            };
        case GradePolicyActionTypes.SUBMIT_GRADE_POLICY_CHECK_START:
            return {
                ...state,
                isLoading: true
            };
        case GradePolicyActionTypes.SUBMIT_GRADE_POLICY_CHECK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                teachers: action.payload
            };
        case GradePolicyActionTypes.SUBMIT_GRADE_POLICY_CHECK_FAIL:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload
            };
        case GradePolicyActionTypes.UPDATE_GRADE_POLICY_CHECK:
            return {
                ...state,
                gradePolicyChecks: {
                    ...state.gradePolicyChecks,
                    [action.payload.teacherName] : {
                        ...state.gradePolicyChecks[action.payload.teacherName],
                        [action.payload.section_id]: {
                            ...state.gradePolicyChecks[action.payload.teacherName][action.payload.section_id],
                            [action.payload.property]: action.payload.value
                        }
                    }
                }
            };
        case GradePolicyActionTypes.RESET_GRADE_POLICY_CHECKS:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default gradePolicyChecksReducer;