import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing(20)
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.defaultColor,
        backgroundColor: "blue",
        width: '100px',
    },
}));

export default function CenteredGrid() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid
            direction="row"
            alignItems="center"
            container spacing={3}>
                <Grid item xs={2}/>
                <Grid
                item xs={8}>
                    <Paper className={classes.paper}>xs=6</Paper>
                </Grid>
                <Grid item xs={2} />
            </Grid>
        </div>
    );
}
