import React, {useEffect} from 'react';
import { connect } from 'react-redux';

import { selectSingleSavedObservation } from '../../redux/saved-observations/saved-observations.selectors';
import { setObservationForm, resetObservationForm } from '../../redux/observation-form/observation-form.actions';
import ObservationPage from '../../components/observation-form/observation-form.component';
import WithSpinner from '../../components/with-spinner/with-spinner.component';

const SavedObservationDetail = ({ observation, match, setObservationForm, isLoading, fetchTeachersAsync, ...otherProps}) => {
    
    useEffect(() => {
        // if(isLoading){
        //     fetchTeachersAsync();
        // }
        setObservationForm(observation);
        
    },[ observation, setObservationForm]);
    
    return (
        <>
            <ObservationPage {...otherProps} />:   
        </>
    );
}

const mapStateToProps = (state, ownProps) => ({
    observation: selectSingleSavedObservation(ownProps.match.params.observationId)(state)
});

const mapDispatchToProps = (dispatch) => ({
    setObservationForm: form => dispatch(setObservationForm(form)),
    resetObservationForm: (details) => dispatch(resetObservationForm(details)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WithSpinner(SavedObservationDetail));