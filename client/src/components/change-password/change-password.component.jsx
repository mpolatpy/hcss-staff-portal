import { useState } from 'react';
import firebase from '../../firebase/firebase.utils';
import { auth } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';

import TextField from '@material-ui/core/TextField';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '400px',
        backgroundColor: theme.palette.background.default
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formItems: {
        padding: theme.spacing(1),
        width: '90%'
    }
}))

const ChangePasswordComponent = ({setSubmissionMessage}) => {
    const user = auth.currentUser;
    const classes = useStyles();
    const [state, setState] = useState({
        newPassword: '',
        confirmPassword: '',
        oldPassword: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(state.newPassword !== state.confirmPassword){
            alert('Please make sure password matches with confirm password.');
            return;
        }

        let message ={
            content: null,
            status: null
        };

        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email, 
            state.oldPassword
        );

        try{
            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(state.newPassword);
            message.content = 'Successfully updated the password';
            message.status = "success";

            setState({
                newPassword: '',
                confirmPassword: '',
                oldPassword: '',
            });

        }catch (e) {
            message.content = e.message;
            message.status = "error";
        }

        setSubmissionMessage(message);

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });
    }

    return (
        <div className={classes.root}>
            {/* <Paper className={classes.root} variant="outlined"> */}
                <div style={{ padding: '10px'}}>
                    <form className={classes.formContainer} onSubmit={handleSubmit}>
                        <Typography align="justify" variant="h6" mb={5}><strong>Change Password</strong></Typography>
                        <TextField name="oldPassword"
                        className={classes.formItems} 
                        onChange={handleChange} 
                        value={state.oldPassword} 
                        label="Current Password"
                        // variant="outlined"
                        type="password"
                        />
                        <TextField 
                        className={classes.formItems} 
                        name="newPassword" 
                        onChange={handleChange} 
                        value={state.newPassword} 
                        label="New Password"
                        // variant="outlined"
                        />
                        <TextField 
                        className={classes.formItems} 
                        name="confirmPassword" 
                        onChange={handleChange} 
                        value={state.confirmPassword} 
                        label="Confirm Password"
                        // variant="outlined"
                        />
                        <Button 
                        className={classes.formItems} 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            {/* </Paper> */}
        </div>
    )
};

const mapDispatchToProps = dispatch => ({
    setSubmissionMessage: (message) => dispatch(setSubmissionMessage(message)),
});

export default connect(null, mapDispatchToProps)(ChangePasswordComponent);