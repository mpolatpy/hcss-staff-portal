import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: '30vw',
        minWidth: 270,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function CustomSelect({label, variant, style, options, name, value, handleSelect, ...otherProps}) {
    const classes = useStyles();

    return (
        <div>
            <FormControl variant={variant} style={style} className={classes.formControl}>
                <InputLabel id={`select-for-${label}-label`}>{label}</InputLabel>
                <Select
                    labelId={`select-for-${label}-label`}
                    id={`select-for-${label}`}
                    value={value}
                    name={name}
                    onChange={handleSelect}
                    label={label}
                    {...otherProps}
                >
                    <MenuItem value="">
                        <em>{''}</em>
                    </MenuItem>
                    {
                        options.map( (option, index) => ( 
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </div>
    );
}
