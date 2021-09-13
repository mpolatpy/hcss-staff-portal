import React, {useEffect} from 'react';
import { connect } from 'react-redux';

import { selectSingleSavedObservation } from '../../redux/saved-observations/saved-observations.selectors';
import { setObservationForm } from '../../redux/observation-form/observation-form.actions';
import { selectObservationForm } from '../../redux/observation-form/observation-form.selectors';
import ObservationPage from '../../components/observation-form/updated-observation-form.component';

const SavedObservationDetail = ({ observation, observationForm, match, setObservationForm, ...otherProps}) => {
    
    useEffect(() => {
        setObservationForm(observation); 
    },[ observation, setObservationForm]);
    
    return (
        <>
            <ObservationPage 
                observationForm={observationForm}
                {...otherProps} 
            />   
        </>
    );
}

const mapStateToProps = (state, ownProps) => ({
    observation: selectSingleSavedObservation(ownProps.match.params.observationId)(state),
    observationForm: selectObservationForm(state)
});

const mapDispatchToProps = (dispatch) => ({
    setObservationForm: form => dispatch(setObservationForm(form)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SavedObservationDetail);