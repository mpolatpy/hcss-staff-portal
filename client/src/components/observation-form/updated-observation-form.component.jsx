import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { submitObservationFormAsync, deleteObservationForm, saveObservationForm } from '../../redux/observation-form/observation-form.actions';
import { selectIsObservationFormSubmitting, selectIsSavedObservation } from '../../redux/observation-form/observation-form.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import WithSpinner from '../with-spinner/with-spinner.component';
import CustomModal from '../modal/modal.component';
import CustomTextArea from '../text-area/text-area.component';
import CustomSpeedDial from '../speed-dial/speed-dial.component';
import { fetchPreviousObservations } from '../observation-form-components/observation-details/observation-details.utils';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import NotesIcon from '@material-ui/icons/Notes';
import CachedIcon from '@material-ui/icons/Cached';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';

import ObservationStep, { getSteps } from './observation-form.utils';
import { useStyles } from './observation-form.styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

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

    const [submitting, setSubmitting] = useState(false);
    const [previousObservations, setPreviousObservations] = useState([]);
    const [editing, setEditing] = useState(false);
    const [isReadOnly, setReadOnly] = useState(readOnly);
    const { teacher, observationDate, observationType } = observationForm.observationDetails;

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = React.useState({});

    const steps = getSteps();
    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = (e) => {
        e.preventDefault();
        const newActiveStep = isLastStep() && !allStepsCompleted() ?
            steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;
        setActiveStep(newActiveStep);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleReset = () => {
        resetObservationForm({
            observer: currentUser,
            schoolYear: currentYear,
        });
        setActiveStep(0);
        setCompleted({});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await submitObservationForm({
            ...observationForm,
            edited: editing,
        });
        history.push('/observations');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await saveObservationForm(observationForm);
        history.push('/observations/saved');
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await deleteObservationForm(props.match.params.observationId);
        history.push('/observations')
    }

    const handleComplete = (e) => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext(e);
    };

    const handleEditing = () => {
        setEditing(!editing);
        setReadOnly(!isReadOnly);
    }

    return (
        submitting ?
            (
                <CircularProgress />
            ) :
            (
                <div className={classes.root}>
                    {
                        isReadOnly && currentUser.id === observationForm.observerId && !editing ?
                            (<>
                                <span style={{ marginRight: '10px' }} >
                                    <Tooltip title="Turn on Editing">
                                    <Switch
                                        checked={editing}
                                        size="small"
                                        onChange={handleEditing}
                                        name="switch_editing"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                    </Tooltip>
                                </span>
                                <Typography variant="caption">This form is submitted by you and it is read-only. If you want to edit, turn on editing.</Typography>
                            </>
                            )
                            : null
                    }
                    {
                        currentUser.id === observationForm.observerId && editing ?
                            (<>
                                <span style={{ marginRight: '10px' }} >
                                <Tooltip title="Turn off Editing">
                                    <Switch
                                        checked={editing}
                                        size="small"
                                        onChange={handleEditing}
                                        name="switch_editing"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                </Tooltip>
                                </span>
                                <Typography variant="caption">You are editing an exisiting observation form. Turn off editing mode if you don't want to edit.</Typography>
                            </>
                            )
                            : null
                    }
                    <Stepper nonLinear activeStep={activeStep} >
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton onClick={handleStep(index)} completed={completed[index]}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper> 
                    <div>
                        <form onSubmit={
                            activeStep === steps.length - 1 ?
                                handleSubmit :
                                handleNext
                        }>
                            <ObservationStep
                                readOnly={isReadOnly}
                                previousObservations={previousObservations}
                                setPreviousObservations={setPreviousObservations}
                                step={activeStep}
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
                                        isReadOnly ? (
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
                                                disabled={!teacher || !observationDate || !observationType }
                                            >
                                                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                            </Button>
                                        )
                                    }
                                    {
                                        !isReadOnly && !isLastStep() && (
                                            <Button 
                                                className={classes.button} 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={handleComplete}
                                            >
                                                Complete Step
                                            </Button>
                                        )
                                    }

                                </div>
                                <div className={classes.resetSaveButtons}>
                                    <CustomSpeedDial
                                        hidden={isReadOnly}
                                        actions={[
                                            {
                                                icon: (<IconButton
                                                    aria-label="save"
                                                    disabled={!teacher || !observationDate || !observationType || editing}
                                                    type="submit"
                                                    onClick={handleSave}
                                                >
                                                    <SaveIcon />
                                                </IconButton>), name: 'Save'
                                            },
                                            {
                                                icon: (<IconButton
                                                    aria-label="saved-observations"
                                                    disabled={!teacher || !observationDate || !observationType || editing}
                                                    type="button"
                                                    onClick={() => fetchPreviousObservations(teacher, setPreviousObservations, currentYear)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>), name: 'Show Previous Observations'
                                            },
                                            {
                                                icon: (
                                                    <CustomModal
                                                        modalIcon={(<NotesIcon />)}
                                                        modalBody={(
                                                            <div style={{ width: '60vw' }}>
                                                                <CustomTextArea />
                                                            </div>
                                                        )}
                                                    />
                                                ),
                                                name: 'Notes'
                                            }, {
                                                icon: (observationForm.isSavedObservation ?
                                                    (
                                                        <CustomModal
                                                            modalIcon={(<DeleteIcon />)}
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
                                                            disabled={editing}
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
                    </div> 
                </div>
            )
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
