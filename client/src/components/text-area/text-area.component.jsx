import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectObservationNotes } from '../../redux/observation-form/observation-form.selectors';
import { setObservationNotes } from '../../redux/observation-form/observation-form.actions';

import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    observationNotes: {
        width: '100%',
        padding: '12px 20px',
        marginTop: theme.spacing(1),
        // boxSizing: 'border-box',
        // border: '2px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    }, 
    observationNotesContainer: {
        marginTop: theme.spacing(1)
    }
}));

const CustomTextArea = ({ observationNotes, setObservationNotes, readOnly }) => {
    const classes = useStyles();

    const handleChange = (e) => {
        const { value } = e.target;
        setObservationNotes(value)
    }

    return (
        <div className={classes.observationNotesContainer}>
            <Typography variant="subtitle1">Observation Notes</Typography>
            <TextareaAutosize
                value={observationNotes}
                onChange={handleChange}
                className={classes.observationNotes}
                aria-label="observation notes"
                rowsMin={8}
                readOnly={readOnly}
                placeholder="Observation Notes"
            />
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    observationNotes: selectObservationNotes
})

const mapDispatchToProps = dispatch => ({
    setObservationNotes: notes => dispatch(setObservationNotes(notes))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomTextArea);

