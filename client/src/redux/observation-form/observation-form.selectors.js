import { createSelector } from 'reselect';


export const selectObservationForm = state => state.observationForm;

export const selectObservationFormDetails = createSelector(
    [selectObservationForm], observationForm => observationForm.observationDetails
);

export const selectObservationType = createSelector( 
    [selectObservationFormDetails], observationDetails => observationDetails.observationType
);

export const selectTeacher = createSelector( 
    [selectObservationFormDetails], observationDetails => observationDetails.teacher
);

export const selectStandardOne = createSelector(
    [selectObservationForm], observationForm => observationForm.domainOne
);

export const selectIsSavedObservation = createSelector(
    [selectObservationForm], observationForm => observationForm.isSavedObservation
);

export const selectStandardTwo = createSelector(
    [selectObservationForm], observationForm => observationForm.domainTwo
);

export const selectStandardThree = createSelector(
    [selectObservationForm], observationForm => observationForm.domainThree
);

export const selectStandardFour = createSelector(
    [selectObservationForm], observationForm => observationForm.domainFour
);

export const selectEvaluationScore = createSelector(
    [selectObservationForm], observationForm => observationForm.evaluationScores
);

export const selectObservationNotes = createSelector(
    [selectObservationForm], observationForm => observationForm.observationNotes
);

export const selectIsObservationFormSubmitting = createSelector(
    [selectObservationForm], observationForm => observationForm.isSubmitting
);

export const selectObservationFormSubmissionMessage = createSelector(
    [selectObservationForm], observationForm => observationForm.submissionMessage
);
