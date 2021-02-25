import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: "white"
    },
    title: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
    },
    toolBar: {
        backgroundColor: '#1976d2',
        color: "white"
    },
    linkEl: {
        textDecoration: "none",
    }
}));

function ButtonAppBar({ match, location }) {
    const classes = useStyles();

    if((match && match.url === '/' && match.isExact) || (location.pathname === '/test') ){
        return null;
    } 

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.toolBar}>
                    <div>
                        <img width="45" alt="logo" src="https://east.hampdencharter.org/wp-content/uploads/2020/01/logo-east-big.png" />
                    </div>
                    <Typography component="h1" variant="h6" className={classes.title}>
                        HCSS Staff Portal
                    </Typography>
                    <Link className={classes.linkEl} to="/">
                        <Button className={classes.menuButton}>Login</Button>
                    </Link>
                    <Link className={classes.linkEl} to="/home">
                        <Button className={classes.menuButton}>Home</Button>
                    </Link>
                    <Link className={classes.linkEl} to="/users">
                        <Button className={classes.menuButton}>Users</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default withRouter(ButtonAppBar);