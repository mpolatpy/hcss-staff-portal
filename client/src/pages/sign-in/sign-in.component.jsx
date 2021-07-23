import React from 'react';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';

import useStyles from "./sign-in.styles";

import { auth } from '../../firebase/firebase.utils';

function SignInForm({ history })  {

    const classes = useStyles();

    const [state, setState] = useState({
        email: '',
        password: '',
        errorMessage: null
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({...state, [name]: value});
    }

    const handleSubmit = async event => {
        event.preventDefault();
        const { email, password } = state;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            setState({ email: '', password: '', errorMessage:'' });
        } catch (error) {
            setState({ 
                ...state,
                password:'', 
                errorMessage: "Invalid username or password. Please try again."
            });
        }
    }

    return (

        <div className={classes.root}>
        <Grid direction="row" container spacing={3}>
            <Grid item xs={2} sm={3} md={4} lg={4}/>
            <Grid item className={classes.sign_in_container} xs={8} sm={6} md={4} lg={4}>
            <div className={classes.innerDiv}>
                <div className={classes.logo}>
                    <img width="125" alt="logo" src="https://east.hampdencharter.org/wp-content/uploads/2020/01/logo-east-big.png" />
                </div>
                <div className={`${classes.form_input} ${classes.logo}`}>
                        <h2 className={classes.sign_in_text}>Sign in</h2>
                    <span>to continue HCSS Staff Portal.</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <TextField
                        className={classes.form_input}
                        onChange={handleChange}
                        fullWidth 
                        required
                        value={state.email}
                        type="email"
                        name="email"
                        label="Email"
                        variant="outlined"
                    />
                    <TextField
                        className={classes.form_input}
                        required
                        fullWidth 
                        value={state.password}
                        onChange={handleChange}
                        type="password"
                        name="password"
                        label="Password"
                        variant="outlined"
                    />
                    {
                        state.errorMessage ?
                        <Alert className={classes.errorMessage} severity="error">{state.errorMessage}</Alert>:
                        null
                    }
                    <Button fullWidth className={classes.sign_in_button} type="submit" variant="contained">Submit</Button>
                </form>
                </div>
            </Grid>
            <Grid item xs={2} sm={3} md={4} lg={4} />
        </Grid>
    </div>
    );
}

export default withRouter(SignInForm);
