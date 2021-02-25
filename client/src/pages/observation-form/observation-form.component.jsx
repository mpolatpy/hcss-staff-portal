import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; 
import { createStructuredSelector } from 'reselect';

import { submitObservationFormAsync, deleteObservationForm } from '../../redux/observation-form/oservation-form.actions'; 
import { 
    selectIsObservationFormSubmitting,
    selectObservationForm
} from '../../redux/observation-form/oservation-form.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import WithSpinner from '../../components/with-spinner/with-spinner.component';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

import ObservationStep, { getSteps } from './observation-form.utils';
import { useStyles } from './observation-form.styles';

const ObservationPage = (props) => {
    const { 
        observationForm,
        currentUser,
        currentYear,
        deleteObservationForm,
        submitObservationForm, 
        resetSubmissionMessage,
        resetObservationForm,
        history,
        readOnly,
        ...otherProps
    } = props;

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const handleNext = (e) => {
        e.preventDefault();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        resetObservationForm({
            observer: currentUser,
            schoolYear: currentYear,
        });
        setActiveStep(0);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitObservationForm(observationForm, 'observations');
        history.push('/observations');
    };

    const handleSave = (e) => {
        e.preventDefault();
        submitObservationForm(observationForm, 'savedObservations');
        history.push('/observations');
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteObservationForm(observationForm);
        history.push('/observations');
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index, steps) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <form onSubmit={
                                index === steps.length - 1 ?
                                    handleSubmit :
                                    handleNext
                            }>
                            <ObservationStep
                                readOnly={readOnly} 
                                step={index}
                                currentUser={currentUser}
                                currentYear={currentYear}
                                observationForm={observationForm}
                                {...otherProps}
                            />
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        variant="outlined"
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                    </Button>
                                </div>
                                <div className={classes.resetSaveButtons}>
                                        {
                                            observationForm.isSavedObservation ?
                                                (<Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={handleDelete}
                                                    className={classes.button}
                                                >
                                                    Delete
                                                </Button>) : (
                                                <Button
                                                    // disabled={activeStep === 0}
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={handleReset}
                                                    className={classes.button}
                                                >
                                                    Reset
                                                </Button>
                                                )
                                        }
                                    <Button
                                        disabled={activeStep === 0}
                                        type="submit"
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleSave}
                                        className={classes.button}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                            </form>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            
            
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    observationForm: selectObservationForm,
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    isLoading: selectIsObservationFormSubmitting,
});

const mapDispatchToProps = dispatch => ({
    submitObservationForm: (observationForm, collectionName) => dispatch(submitObservationFormAsync(observationForm, collectionName)),
    deleteObservationForm: (observationForm) => dispatch(deleteObservationForm(observationForm))
});

export default connect(mapStateToProps, mapDispatchToProps)(WithSpinner(withRouter(ObservationPage)));
