import LessonPlanActionTypes from './lesson-plan.types';

const INITIAL_STATE = {
    isLoading: false,
    teachers: [],
    errorMessage: undefined
};

const lessonPlanChecksReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LessonPlanActionTypes.SET_LESSON_PLAN_CHECKS_START:
            return {
                ...state,
                isLoading: true
            };
        case LessonPlanActionTypes.SET_LESSON_PLAN_CHECKS_SUCCESS:
            return {
                ...state,
                teachers: [...state.teachers, ...action.payload],
                isLoading: false
            };
        case LessonPlanActionTypes.SET_LESSON_PLAN_CHECKS_FAIL:
            return {
                ...state,
                isLoading: false,
                errorMessage: "An error occurred! Please try again"
            };
        case LessonPlanActionTypes.SUBMIT_LESSON_PLAN_CHECK_START:
            return {
                ...state,
                isLoading: true
            };
        case LessonPlanActionTypes.SUBMIT_LESSON_PLAN_CHECK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                teachers: action.payload
            };
        case LessonPlanActionTypes.SUBMIT_LESSON_PLAN_CHECK_FAIL:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload
            };
        case LessonPlanActionTypes.RESET_LESSON_PLAN_CHECKS:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default lessonPlanChecksReducer;