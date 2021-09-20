import firebase, { auth } from '../../firebase/firebase.utils';

export function linkWithPopup(setSubmissionMessage) {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.currentUser.linkWithPopup(provider).then((result) => {
        const credential = result.credential;
        const user = result.user;

        setSubmissionMessage({
            content: 'Succesfully Actived Google SignIn!',
            status: 'success'
        });
    }).catch((e) => {
        console.log(e)
        setSubmissionMessage({
            content: e.message,
            status: 'error'
        });
    });
}