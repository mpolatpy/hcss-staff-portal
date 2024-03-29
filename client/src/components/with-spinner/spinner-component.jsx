import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme) => ({
    spinner: {
        height: '60vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));



const Spinner = () => {
    const classes = useStyles();

    return (
        <div className={classes.spinner} >
            <CircularProgress />
        </div>
    ) 
};


export default Spinner;