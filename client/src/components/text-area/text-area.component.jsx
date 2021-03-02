import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectObservationNotes } from '../../redux/observation-form/observation-form.selectors';
import { setObservationNotes } from '../../redux/observation-form/observation-form.actions';

import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    observationNotes: {
        width: '90%',
        padding: '12px 20px',
        boxSizing: 'border-box',
        border: '2px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    }
}));

const CustomTextArea = ({ observationNotes, setObservationNotes }) => {
    const classes = useStyles();

    const handleChange = (e) => {
        const { value } = e.target;
        setObservationNotes(value)
    }

    return ( 
        <TextareaAutosize 
        value={observationNotes}
        onChange={handleChange}
        className={classes.observationNotes} 
        aria-label="observation notes" 
        rowsMin={8}
        placeholder="Observation Notes" 
         />
    )
}

const mapStateToProps = createStructuredSelector({
    observationNotes: selectObservationNotes
})

const mapDispatchToProps = dispatch => ({
    setObservationNotes: notes => dispatch(setObservationNotes(notes))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomTextArea);

