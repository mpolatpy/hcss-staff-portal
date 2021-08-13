import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; 
import { createStructuredSelector } from 'reselect';

import { submitObservationFormAsync, deleteObservationForm, saveObservationForm} from '../../redux/observation-form/observation-form.actions'; 
import { selectIsObservationFormSubmitting,selectIsSavedObservation} from '../../redux/observation-form/observation-form.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import WithSpinner from '../../components/with-spinner/with-spinner.component';
import CustomModal from '../../components/modal/modal.component';
import CustomTextArea from '../text-area/text-area.component';
import CustomSpeedDial from '../speed-dial/speed-dial.component';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import NotesIcon from '@material-ui/icons/Notes';
import CachedIcon from '@material-ui/icons/Cached';
import Stepper from '@material-ui/core/Stepper'; 
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

import ObservationStep, { getSteps } from './observation-form.utils';
import { useStyles } from './observation-form.styles';
import { Typography } from '@material-ui/core';

const ObservationPage = (props) => {
    const { 
        isSavedObservation,
        observationForm,
        currentUser,
        currentYear,
        deleteObservationForm,
        submitObservationForm,
        saveObservationForm, 
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
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        // window.scrollTo(0, 0);
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
        submitObservationForm(observationForm);
        history.push('/observations');
    };

    const handleSave = (e) => {
        e.preventDefault();
        saveObservationForm(observationForm);
        history.push('/observations/saved');
    }; 

    const handleDelete = (e) => {
        e.preventDefault();
        deleteObservationForm(props.match.params.observationId)
        history.push('/observations')
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
                                    {
                                        readOnly ? (
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={activeStep === steps.length - 1}
                                                className={classes.button}
                                            >
                                                Next
                                            </Button>
                                         ) : ( 
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                            >
                                                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                            </Button>
                                         )
                                    }
                                    
                                </div>
                                <div className={classes.resetSaveButtons}>
                                    <CustomSpeedDial 
                                        hidden={readOnly}
                                        actions={[
                                            {icon: (<IconButton
                                                        aria-label="save"
                                                        disabled={activeStep === 0}
                                                        type="submit"
                                                        onClick={handleSave}
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>), name: 'Save'
                                            },
                                            {
                                                icon: (
                                                    <CustomModal
                                                        modalIcon= {( <NotesIcon /> )}
                                                        modalBody={( 
                                                            <div style={{width: '60vw'}}>
                                                                <CustomTextArea />
                                                            </div>
                                                        )}
                                                    />
                                                 ),
                                                name: 'Notes'
                                            }, {
                                                icon: ( observationForm.isSavedObservation ?
                                                (
                                                <CustomModal
                                                    modalIcon = {( <DeleteIcon /> )}
                                                    modalBody={( 
                                                        <div>
                                                            <Typography variant="h5">
                                                                Please Confirm Delete
                                                            </Typography>
                                                            <p>Once deleted, you will not be able to retrieve this observation back</p>
                                                            <div>
                                                            <Button
                                                            type="submit"
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={handleDelete}
                                                            className={classes.button}
                                                            >
                                                                Delete
                                                            </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                                ) : (
                                                <IconButton
                                                    aria-label="reset"
                                                    onClick={handleReset}
                                                    // className={classes.button}
                                                >
                                                    <CachedIcon />
                                                </IconButton>
                                                )
                                                    
                                                ),
                                                name: observationForm.isSavedObservation ? 'Delete' : 'Reset'
                                            }
                                        ]}
                                    />
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
    isSavedObservation: selectIsSavedObservation,
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    isLoading: selectIsObservationFormSubmitting,
});

const mapDispatchToProps = dispatch => ({
    submitObservationForm: (observationForm, collectionName) => dispatch(submitObservationFormAsync(observationForm, collectionName)),
    deleteObservationForm: (observationForm) => dispatch(deleteObservationForm(observationForm)),
    saveObservationForm: (observationForm) => dispatch(saveObservationForm(observationForm)), 
});

export default connect(mapStateToProps, mapDispatchToProps)(WithSpinner(withRouter(ObservationPage)));
