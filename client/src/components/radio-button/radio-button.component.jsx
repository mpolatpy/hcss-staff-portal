import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    radio: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
}));


export default function CustomRadioButtons({ name, label, value, options, handleRadioChange}) {
    const classes = useStyles();
    
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" style={{marginBottom: '5px'}}>{label}</FormLabel>
            <RadioGroup row aria-label={label} name={name} value={value} onChange={handleRadioChange}>
                {
                    options.map( (option, idx) => ( 
                        <FormControlLabel
                            className={classes.radio}
                            key={idx}
                            value={option}
                            control={<Radio color="primary" />}
                            label={option}
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                            labelPlacement="top"
                        />
                    ))
                }
            </RadioGroup>
        </FormControl>
    );
}

