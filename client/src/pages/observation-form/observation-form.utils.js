import React from 'react';
import { connect } from 'react-redux';

import { 
    setObservationDetails,
    setStandardOne,
    setStandardTwo,
    setStandardThree,
    setStandardFour,
} from '../../redux/observation-form/oservation-form.actions';

import ObservationFormDetails from '../../components/observation-form-components/observation-details/observation-details.component';
import ObservationStandardComponent from '../../components/observation-form-components/standards/observation-standard.component';
import { rubric } from '../../components/observation-form-components/observationRubric';
import CustomTextArea from '../../components/text-area/text-area.component';

export function getSteps() {
    return ['Observation Details', 'Domain I', 'Domain II', 'Domain III', 'Domain IV', 'Observavtion Notes'];
}

function ObservationStep(props) {
    const { 
        step, 
        observationForm,
        setObservationFormDetails,
        setStandardOne,
        setStandardTwo,
        setStandardThree,
        setStandardFour,
        readOnly,
        ...otherProps
     } = props;

    switch (step) {
        case 0:
            return (
                <div>
                    <ObservationFormDetails
                        readOnly={readOnly}
                    observationDetails={observationForm.observationDetails}
                    setObservationFormDetails={setObservationFormDetails}
                    {...otherProps} 
                    />
                </div>
            );
        case 1:
            return (
                <div>
                    <ObservationStandardComponent 
                        readOnly={readOnly}
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
                        readOnly={readOnly}
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
                        readOnly={readOnly}
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
                    <CustomTextArea readOnly={readOnly} {...otherProps} />
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
    setStandardFour: observationItems => dispatch(setStandardFour(observationItems))
});


export default connect(null, mapDispatchToProps)(ObservationStep);