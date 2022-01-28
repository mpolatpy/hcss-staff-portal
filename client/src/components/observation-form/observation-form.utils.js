import React,{useState} from 'react';
import { connect } from 'react-redux';

import { 
    setObservationDetails,
    setStandardOne,
    setStandardTwo,
    setStandardThree,
    setStandardFour,
} from '../../redux/observation-form/observation-form.actions';

import ObservationFormDetails from '../observation-form-components/observation-details/observation-details.component';
import ObservationStandardComponent from '../observation-form-components/standards/observation-standard.component';
import { rubric } from '../observation-form-components/observationRubric';
import CustomTextArea from '../text-area/text-area.component';

export function getSteps() {
    return ['Observation Details', 'Domain I', 'Domain II', 'Domain III', 'Domain IV', 'Observation Notes'];
}

function ObservationStep(props) {
    

    const { 
        step, 
        currentUser,
        currentYear,
        observationForm,
        setObservationFormDetails,
        setStandardOne,
        setStandardTwo,
        setStandardThree,
        setStandardFour,
        previousObservations, 
        setPreviousObservations,
        readOnly,
        ...otherProps
     } = props;

    switch (step) {
        case 0:
            return (
                <div>
                    <ObservationFormDetails
                        currentUser={currentUser}
                        setPreviousObservations={setPreviousObservations}
                        readOnly={readOnly}
                        setObservationFormDetails={setObservationFormDetails}
                        {...otherProps} 
                    />
                </div>
            );
        case 1:
            return (
                <div>
                    <ObservationStandardComponent 
                        previousObservations={previousObservations}
                        readOnly={readOnly}
                        currentUser={currentUser}
                        domainName="domainOne"
                        domain={rubric.domainOne}
                        domainRdx={observationForm.domainOne}
                        setDomainRdx={setStandardOne}
                        {...otherProps}
                    />
                </div>
            );
        case 2:
            return (
                <div>
                    <ObservationStandardComponent
                        previousObservations={previousObservations}
                        readOnly={readOnly}
                        currentUser={currentUser}
                        domainName="domainTwo"
                        domain={rubric.domainTwo}
                        domainRdx={observationForm.domainTwo}
                        setDomainRdx={setStandardTwo}
                        {...otherProps}
                    />
                </div>
            );
        case 3:
            return (
                <div>
                    <ObservationStandardComponent
                        previousObservations={previousObservations}
                        readOnly={readOnly}
                        currentUser={currentUser}
                        domainName="domainThree"
                        domain={rubric.domainThree}
                        domainRdx={observationForm.domainThree}
                        setDomainRdx={setStandardThree}
                        {...otherProps}
                    />
                </div>
            );
        case 4:
            return (
                <div>
                    <ObservationStandardComponent
                        readOnly={readOnly}
                        currentUser={currentUser}
                        previousObservations={previousObservations}
                        domainName="domainFour"
                        domain={rubric.domainFour}
                        domainRdx={observationForm.domainFour}
                        setDomainRdx={setStandardFour}
                        {...otherProps}
                    />
                </div>
            );
        case 5: 
            return ( 
                <div>
                    <CustomTextArea 
                        readOnly={readOnly} 
                        currentUser={currentUser}
                        previousObservations={previousObservations}
                        {...otherProps} 
                    />
                </div>
            );
        default:
            return 'Unknown step';
    }
}

const mapDispatchToProps = dispatch => ({
    setObservationFormDetails: details => dispatch(setObservationDetails(details)),
    setStandardOne: observationItems => dispatch(setStandardOne(observationItems)),
    setStandardTwo: observationItems => dispatch(setStandardTwo(observationItems)),
    setStandardThree: observationItems => dispatch(setStandardThree(observationItems)),
    setStandardFour: observationItems => dispatch(setStandardFour(observationItems)),
});


export default connect(null, mapDispatchToProps)(ObservationStep);