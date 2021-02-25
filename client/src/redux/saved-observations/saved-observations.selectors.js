import { createSelector } from 'reselect';

export const selectSavedObservationsState = state => state.savedObservations;

export const selectSavedObservations = createSelector(
    [selectSavedObservationsState], savedObservations => savedObservations.observations
);

export const selectSavedObservationsList = createSelector(
    [selectSavedObservations], 
    savedObservations => savedObservations ? Object.keys(savedObservations).map(
        key => savedObservations[key]
    ) : []
);

export const selectSavedObservationsIsloading = createSelector(
    [selectSavedObservationsState], savedObservations => savedObservations.isLoading
);

export const selectSavedObservationsErrorMessage = createSelector(
    [selectSavedObservationsState], savedObservations => savedObservations.errorMessage
);

export const selectSingleSavedObservation = id => createSelector(
    [selectSavedObservations], observations => observations[id]
);