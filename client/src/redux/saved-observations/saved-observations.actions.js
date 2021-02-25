import SavedObservationsActionTypes from './saved-observations.types';
import { firestore, convertCollectionSnapshotDataToMap } from '../../firebase/firebase.utils';

export const resetSavedObservations = () => ({
    type: SavedObservationsActionTypes.RESET_SAVED_OBSERVATIONS
});

const fetchSavedObservationsStart = () => ({
    type: SavedObservationsActionTypes.FETCH_SAVED_OBSERVATIONS_START
});

const fetchSavedObservationsSuccess = (observations) => ({
    type: SavedObservationsActionTypes.FETCH_SAVED_OBSERVATIONS_SUCCESS,
    payload: observations
});

const fetchSavedObservationsFail = (errorMessage) => ({
    type: SavedObservationsActionTypes.FETCH_SAVED_OBSERVATIONS_FAIL,
    payload: errorMessage
});

export const fetchSavedObservationsAsync = (currentUser) => {
    return dispatch => {
        const collectionRef = firestore.collection('savedObservations')
                .where(
                    'observationDetails.observer.id', 
                    '==', 
                    currentUser.id
                ).orderBy('observationDetails.observationDate', 'desc');

        dispatch(fetchSavedObservationsStart());

        collectionRef.get()
            .then(snapshot => {
                const observations = convertCollectionSnapshotDataToMap(snapshot);
                dispatch(fetchSavedObservationsSuccess(observations))
            })
            .catch(err => dispatch(fetchSavedObservationsFail(err.message)))
    }
};


