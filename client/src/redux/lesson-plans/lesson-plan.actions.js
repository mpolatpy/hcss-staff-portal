import LessonPlanActionTypes from './lesson-plan.types';
import { firestore } from '../../firebase/firebase.utils';
import { getOrCreateScoreDocument, calculateLessonPlanAverage } from './lesson-plan.utils';

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
                if( Object.keys(fetchedData).includes('teachers') && (fetchedData['teachers'].length > 0)){
                    dispatch(setLessonPlanChecksSuccess(fetchedData.teachers));
                } else {
                    dispatch(setLessonPlanChecksFail());
                }
            } else {
                dispatch(setLessonPlanChecksFail());
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

export const saveLessonPlanCheckStart = () => ({
    type: LessonPlanActionTypes.SAVE_LESSON_PLAN_CHECK_START
});

export const saveLessonPlanCheckSuccess = (updatedTeacherList) => ({
    type: LessonPlanActionTypes.SAVE_LESSON_PLAN_CHECK_SUCCESS,
    payload: updatedTeacherList
});

export const saveLessonPlanCheckFail = (message) => ({
    type: LessonPlanActionTypes.SAVE_LESSON_PLAN_CHECK_FAIL,
    payload: message
});

export const submitLessonPlanCheck = (lessonPlan, year, selectedTeachers) => {
    const { teacher, observer, date } = lessonPlan;
    const updatedTeacherList = selectedTeachers.filter ( element => element.id !== teacher.id );

    return async dispatch => {
        dispatch(submitLessonPlanCheckStart());

        try{
            const ref = await getOrCreateScoreDocument(teacher.id, year);
            const previous = await ref.get();
            const updatedScore = calculateLessonPlanAverage(previous, lessonPlan);
            const newRef = firestore.collection(`lessonPlanScores/${year}/${teacher.id}`).doc();
            const emailRef = firestore.collection("emails").doc();
            const notificationRef = firestore.collection(`notifications`).doc(year).collection(teacher.id).doc();

            await firestore.runTransaction(async (transaction) => {
                transaction.set(newRef, lessonPlan);
                transaction.update(ref, updatedScore); 
                transaction.set(notificationRef, {
                    message: 'Notification - New lesson plan feedback',
                    display: true,
                    date: date,
                    viewLink: `/staff/lesson-plans/${teacher.id}`
                });
                transaction.set(emailRef, ({
                    to: teacher.email,
                    message: {
                        subject: `Notification - Lesson Plan Feedback`,
                        text: `Hi ${teacher.firstName},

This is an automated notificication for a new lesson plan feedback.

Observer: ${observer.firstName} ${observer.lastName}
Date: ${date.toLocaleDateString("en-US")}

Please view the details and the feedback in HCSS Staff Portal.

https://staffportal.hampdencharter.org

Thank you

`,
                            // html: "This is the <code>HTML</code> section of the email body.",
                        },
                    }));
            });
            dispatch(submitLessonPlanCheckSuccess(updatedTeacherList))
        } catch (e){
            dispatch(submitLessonPlanCheckFail(e.message));
        }
    } 
};

export const resetLessonPlanChecks = () => ({
    type: LessonPlanActionTypes.RESET_LESSON_PLAN_CHECKS
});


