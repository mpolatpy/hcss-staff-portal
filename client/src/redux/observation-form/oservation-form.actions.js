import ObservationFormActionTypes from './oservation-form.types';
import { firestore } from '../../firebase/firebase.utils';
// import { calculateObservationScore } from './observation.utils';

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

export const submitObservationFormAsync = (observationFormData, collectionName) => {
    const isSavedObservation = collectionName === 'savedObservations';
    const { observationDetails, domainOne, domainTwo,
        domainThree, domainFour, observationNotes } = observationFormData;
    const observerId = observationDetails.observer.id;
    const teacherId= observationDetails.teacher.id;
    const {observationDate} = observationDetails;
    const newObservationRef = firestore.collection(collectionName).doc();

    const observationForm = {
        observerId: observerId,
        teacherid: teacherId,
        observationDate: observationDate,
        firestoreRef: newObservationRef.id,
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
            await newObservationRef.set(observationForm);
            dispatch(submitObservationFormSuccess());
            if (observationFormData.isSavedObservation) {
                await firestore.collection('savedObservations')
                        .doc(observationFormData.firestoreRef)
                        .delete();
            }
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

export const deleteObservationForm = (observationForm) => {

    const firestoreRef = observationForm.firestoreRef;

    return dispatch => {
        dispatch(deleteObservationFormStart());

        firestore.collection('savedObservations').doc(firestoreRef)
                .delete()
                .then(() => dispatch(deleteObservationFormSuccess()))
                .catch(e => dispatch(deleteObservationFormFail(e.message)))
    }
}