import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { setObservationForm } from '../../redux/observation-form/observation-form.actions';
import { selectObservationForm } from '../../redux/observation-form/observation-form.selectors';
import ObservationPage from '../../components/observation-form/observation-form.component';

const SubmittedObservation = ({ observationForm, match, setObservationForm, ...otherProps}) => {
    
    useEffect(() => {
        const getObservationData = async () => {
            const observationRef = firestore.doc(`observations/${match.params.observationId}`);
            const observationData = await observationRef.get();
            const observation = observationData.data();
            setObservationForm(observation);
        }
        getObservationData();
    },[setObservationForm, match.params.observationId]);
    
    return (
        <>
            <ObservationPage 
                readOnly
                observationForm={observationForm}
                {...otherProps} 
            />   
        </>
    );
}

const mapStateToProps = createStructuredSelector({
    observationForm: selectObservationForm
});

const mapDispatchToProps = (dispatch) => ({
    setObservationForm: form => dispatch(setObservationForm(form)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmittedObservation);