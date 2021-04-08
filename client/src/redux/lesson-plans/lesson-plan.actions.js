import LessonPlanActionTypes from './lesson-plan.types';
import { firestore } from '../../firebase/firebase.utils';

export const setLessonPlanChecksStart = () => ({
    type: LessonPlanActionTypes.SET_LESSON_PLAN_CHECKS_START
});

export const setLessonPlanChecksSuccess = teachers => ({
    type: LessonPlanActionTypes.SET_LESSON_PLAN_CHECKS_SUCCESS,
    payload: teachers
});

export const setLessonPlanChecksFail = () => ({
    type: LessonPlanActionTypes.SET_LESSON_PLAN_CHECKS_FAIL
});

export const setLessonPlans = (currentUserId) => {

    return async dispatch => {
        dispatch(setLessonPlanChecksStart());

        try{
            const ref = firestore.doc(`observationTemplates/${currentUserId}`);
            const snapshot = await ref.get();

            if (snapshot.exists){
                const fetchedData = snapshot.data();
                if(Object.keys(fetchedData).includes('teachers')){
                    dispatch(setLessonPlanChecksSuccess(fetchedData.teachers));
                }
            }
        } catch (e){
            dispatch(setLessonPlanChecksFail());
        }
    }
};

export const submitLessonPlanCheckStart = () => ({
    type: LessonPlanActionTypes.SUBMIT_LESSON_PLAN_CHECK_START
});

export const submitLessonPlanCheckSuccess = (updatedTeacherList) => ({
    type: LessonPlanActionTypes.SUBMIT_LESSON_PLAN_CHECK_SUCCESS,
    payload: updatedTeacherList
});

export const submitLessonPlanCheckFail = (message) => ({
    type: LessonPlanActionTypes.SUBMIT_LESSON_PLAN_CHECK_FAIL,
    payload: message
});

export const submitLessonPlanCheck = (lessonPlan, year, selectedTeachers) => {

    const { teacher } = lessonPlan;
    console.log(teacher);
    const updatedTeacherList = selectedTeachers.filter ( 
        element => element.id !== teacher.id
    );

    return async dispatch => {
        dispatch(submitLessonPlanCheckStart());

        try{
            const ref = firestore.collection(`lessonPlanScores/${year}/${teacher.id}`).doc();
            await ref.set(lessonPlan);
            dispatch(submitLessonPlanCheckSuccess(updatedTeacherList))
        } catch (e){
            dispatch(submitLessonPlanCheckFail(e.message));
        }
    }
};

export const resetLessonPlanChecks = () => ({
    type: LessonPlanActionTypes.RESET_LESSON_PLAN_CHECKS
});
