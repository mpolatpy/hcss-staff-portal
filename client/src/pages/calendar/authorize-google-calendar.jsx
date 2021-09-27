import { useEffect } from 'react';
import { firestore } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from "axios";
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import Typography from "@material-ui/core/Typography";

const AuthorizeGoogleCalendar = ({ location, history, currentUser, setSubmissionMessage }) => {

    useEffect(() => {
        const getTokens = async () => {
            if(!currentUser) return;

            try {
                const code = location.search.split('&')[0].split('=')[1];
                const resp = await axios.post('/get-tokens-for-calendar', {
                    code
                });
                const tokens = resp.data;
                
                if('access_token' in tokens){
                    await firestore.doc(`googleCalendar/${currentUser.id}`).set(tokens);
                }

                setSubmissionMessage({
                    content: 'Successfully Authorized Google Calendar',
                    status: 'success'
                });
            } catch (e) {
                console.log(e);
                setSubmissionMessage({
                    content: e.message,
                    status: 'error'
                });
            }
            history.push('/calendar');
        };

        getTokens();
    }, []);

    return (
        <div>
            <Typography>
                Please wait. You will be redirected to calendar page.
            </Typography>
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setSubmissionMessage: message => dispatch(setSubmissionMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizeGoogleCalendar);