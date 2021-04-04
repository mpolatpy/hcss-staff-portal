import ObservationFormActionTypes from './observation-form.types';
import { firestore } from '../../firebase/firebase.utils';
import { getUpdatedObservationScore, getOrCreateScoreDocument } from './observation.utils';

export const setObservationForm = observationForm => ({
    type: ObservationFormActionTypes.SET_OBSERVATION_FORM,
    payload: observationForm
});

export const setObservationDetails = observationDetails => ({
    type: ObservationFormActionTypes.SET_OBSERVATION_DETAILS,
    payload: observationDetails
});

export const setStandardOne = standardOne => ({
    type: ObservationFormActionTypes.SET_STANDARD_ONE,
    payload: standardOne
});

export const setStandardTwo = standardTwo => ({
    type: ObservationFormActionTypes.SET_STANDARD_TWO,
    payload: standardTwo
});

export const setStandardThree = standardThree => ({
    type: ObservationFormActionTypes.SET_STANDARD_THREE,
    payload: standardThree
});

export const setStandardFour = standardFour => ({
    type: ObservationFormActionTypes.SET_STANDARD_FOUR,
    payload: standardFour
});

export const setObservationNotes = notes => ({
    type: ObservationFormActionTypes.SET_OBSERVATION_NOTES,
    payload: notes
});

export const resetSubmissionMessage = () => ({
    type: ObservationFormActionTypes.RESET_SUBMISSION_MESSAGE,
});

export const resetObservationForm = (observationDetails) => ({
    type: ObservationFormActionTypes.RESET_OBSERVATION_FORM,
    payload: observationDetails,
});

const submitObservationFormStart = () => ({
    type: ObservationFormActionTypes.SUBMIT_OBSERVATION_FORM_START,
});

const submitObservationFormSuccess = () => ({
    type: ObservationFormActionTypes.SUBMIT_OBSERVATION_FORM_SUCCES,
});

const submitObservationFormFail = errorMessage => ({
    type: ObservationFormActionTypes.SUBMIT_OBSERVATION_FORM_FAIL,
    payload: errorMessage
});


export const saveObservationForm = (observationFormData) => {
    const {isSavedObservation, firestoreRef,observationDetails, 
        domainOne, domainTwo, domainThree, domainFour, observationNotes} = observationFormData;
    const observerId = observationDetails.observer.id;
    const {observationDate, observationType, teacher} = observationDetails;
    const teacherId= teacher.id;

    const newObservationRef = isSavedObservation? firestore.collection('savedObservations').doc(firestoreRef.id) :firestore.collection('savedObservations').doc();
    
    const observationForm = {
        observerId: observerId,
        teacherid: teacherId,
        observationType: observationType,
        observationDate: observationDate,
        firestoreRef: newObservationRef,
        isSavedObservation: true,
        submittedAt: new Date(),
        observationDetails,
        domainOne,
        domainTwo,
        domainThree,
        domainFour,
        observationNotes
    };

    return async dispatch => {
        dispatch(submitObservationFormStart());
        try{
            if(isSavedObservation){
                await newObservationRef.update(observationForm);
            }else{
                await newObservationRef.set(observationForm)
            }
            dispatch(submitObservationFormSuccess());
        } catch(e) {
            dispatch(submitObservationFormFail(e.message));
        }
    }

}

export const submitObservationFormAsync = (observationFormData) => {
    const {isSavedObservation, observationDetails, domainOne, domainTwo, 
        domainThree, domainFour, observationNotes} = observationFormData;
    const observerId = observationDetails.observer.id;
    const {observationDate, observationType, teacher} = observationDetails;
    const teacherId= teacher.id;

    const newObservationRef = firestore.collection('observations').doc();
    
    const observationForm = {
        observerId: observerId,
        teacherid: teacherId,
        observationType: observationType,
        observationDate: observationDate,
        firestoreRef: newObservationRef,
        isSavedObservation: isSavedObservation,
        submittedAt: new Date(),
        observationDetails,
        domainOne,
        domainTwo,
        domainThree,
        domainFour,
        observationNotes
    };

    return async dispatch => {
        dispatch(submitObservationFormStart());
        try{
            const schoolYear = observationDetails.schoolYear;
            const scoreRef = await getOrCreateScoreDocument(teacher, schoolYear, observationType);
            const prev = await scoreRef.get();
            const updatedScore = getUpdatedObservationScore(prev, observationFormData);

            await firestore.runTransaction(async (transaction) => {
                transaction.set(newObservationRef, observationForm);

                if (observationFormData.isSavedObservation) {
                    const prevRef = firestore.collection('savedObservations').doc(observationFormData.firestoreRef.id);
                    transaction.delete(prevRef);
                }
                transaction.update(scoreRef, updatedScore)
            });
            
            dispatch(submitObservationFormSuccess()); 
        } catch(e) {
            dispatch(submitObservationFormFail(e.message));
        }
    }

    // return dispatch => {
    //     dispatch(submitObservationFormStart());

    //     newObservationRef
    //         .set(observationForm)
    //         .then( () => dispatch(submitObservationFormSuccess()))
    //         .then( () => {
    //             if(observationFormData.isSavedObservation){
    //                 firestore.collection('savedObservations')
    //                         .doc(observationFormData.firestoreRef)
    //                         .delete()
    //             }
    //         })
    //         .catch( e => dispatch(submitObservationFormFail(e.message)))
    // }
}

const deleteObservationFormStart = () => ({
    type: ObservationFormActionTypes.DELETE_OBSERVATION_FORM_START,
});

const deleteObservationFormSuccess = () => ({
    type: ObservationFormActionTypes.DELETE_OBSERVATION_FORM_SUCCESS,
});

const deleteObservationFormFail = (errorMessage) => ({
    type: ObservationFormActionTypes.DELETE_OBSERVATION_FORM_FAIL,
    pay: errorMessage
});

export const deleteObservationForm = (id) => {
    
    return dispatch => {
        dispatch(deleteObservationFormStart());

        firestore.collection('savedObservations').doc(id)
                .delete()
                .then(() => dispatch(deleteObservationFormSuccess()))
                .catch(e => dispatch(deleteObservationFormFail(e.message)))
    }
}