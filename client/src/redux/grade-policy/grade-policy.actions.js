import GradePolicyActionTypes from './grade-policy.types';
import { firestore } from '../../firebase/firebase.utils';
import { getTeacherSchedules, getOrCreateScoreDocument } from './grade-policy.utils';

export const setGradePolicyCheckStart = () => ({
    type: GradePolicyActionTypes.SET_GRADE_POLICY_CHECKS_START
});

export const setGradePolicyCheckSuccess = gradeCheckData => ({
    type: GradePolicyActionTypes.SET_GRADE_POLICY_CHECKS_SUCCESS,
    payload: gradeCheckData
});

export const setGradePolicyCheckFail = () => ({
    type: GradePolicyActionTypes.SET_GRADE_POLICY_CHECKS_FAIL
});

export const setGradePolicyCheck = (currentUserId) => {

    return async dispatch => {
        dispatch(setGradePolicyCheckStart());

        try{
            const ref = firestore.doc(`observationTemplates/${currentUserId}`);
            const snapshot = await ref.get();

            if (snapshot.exists){
                const fetchedData = snapshot.data();
                if( Object.keys(fetchedData).includes('teachers') && (fetchedData['teachers'].length > 0)){
                    const initialData = await getTeacherSchedules(fetchedData.teachers);
                    dispatch(setGradePolicyCheckSuccess({
                        initialData, 
                        teachers: fetchedData.teachers
                    }));
                } else {
                    dispatch(setGradePolicyCheckFail());
                }
            } else {
                dispatch(setGradePolicyCheckFail());
            }
        } catch (e){
            dispatch(setGradePolicyCheckFail());
        }
    }
};

export const submitGradePolicyCheckStart = () => ({
    type: GradePolicyActionTypes.SUBMIT_GRADE_POLICY_CHECK_START
});

export const submitGradePolicyCheckSuccess = (updatedTeacherList) => ({
    type: GradePolicyActionTypes.SUBMIT_GRADE_POLICY_CHECK_SUCCESS,
    payload: updatedTeacherList
});

export const submitGradePolicyCheckFail = (message) => ({
    type: GradePolicyActionTypes.SUBMIT_GRADE_POLICY_CHECK_FAIL,
    payload: message
});

export const submitGradePolicyCheck = (gradePolicyCheck, year, selectedTeachers) => {
    const { teacher, observer, date } = gradePolicyCheck;
    const updatedTeacherList = selectedTeachers.filter ( element => element.id !== teacher.id );

    return async dispatch => {
        dispatch(submitGradePolicyCheckStart());

        try{
            const newRef = firestore.collection(`gradebookChecks/${year}/${teacher.id}`).doc();
            const emailRef = firestore.collection("emails").doc(); 
            const notificationRef = firestore.collection(`notifications`).doc(year).collection(teacher.id).doc();
            const gradeCheckCountRef = await getOrCreateScoreDocument(observer.id, year, teacher.id);
            const gradeCheckCountSnapshot = await gradeCheckCountRef.get();
            const gradeCheckCount = gradeCheckCountSnapshot.data();

            const updatedTeacherCount = {
                ...gradeCheckCount,
                [teacher.id]: (gradeCheckCount[teacher.id] || 0) + 1
            }
            await firestore.runTransaction(async (transaction) => {
                transaction.set(newRef, gradePolicyCheck);
                transaction.set(gradeCheckCountRef, updatedTeacherCount);
                transaction.set(notificationRef, {
                    message: 'Notification - Grades/Grade Policy Feedback',
                    display: true,
                    date: date,
                    viewLink: `/staff/grading-feedback/${teacher.id}`
                });
                transaction.set(emailRef, ({
                    to: teacher.email,
                    message: {
                        subject: `Notification - Grades/Grade Policy Feedback`,
                        text: `Hi ${teacher.firstName},

This is an automated notificication for a new grading/grade policy feedback.

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
            dispatch(submitGradePolicyCheckSuccess(updatedTeacherList))
        } catch (e){
            dispatch(submitGradePolicyCheckFail(e.message));
        }
    } 
};

export const resetGradePolicyChecks = () => ({
    type: GradePolicyActionTypes.RESET_GRADE_POLICY_CHECKS
});

export const updateGradePolicyCheck = gradeCheckData => ({
    type: GradePolicyActionTypes.UPDATE_GRADE_POLICY_CHECK,
    payload: gradeCheckData
});


