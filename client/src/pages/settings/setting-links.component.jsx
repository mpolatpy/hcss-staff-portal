import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import withAuthorization from '../../components/with-authorization/withAuthorization.component';
import { firestore } from '../../firebase/firebase.utils';
import RegisterLinkForm from '../../components/register-links/register-link-form.component';

const AddLinks = ({setSubmissionMessage}) => {
    
    const [categories, setCategories] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const ref = firestore.doc('links/categories');
            const snapshot = await ref.get();
            setCategories(snapshot.data().all)
        };

        const fetchLinks = async () => {
            const ref = firestore.doc('links/data');
            const snapshot = await ref.get();
            
            if(snapshot.exists)
                setLinks(snapshot.data().all);
        };

        fetchLinks();
        fetchCategories();
    },[]);

    return ( 
        <div>
            <RegisterLinkForm 
                categories={categories} 
                links={links}
                setSubmissionMessage={setSubmissionMessage}
            />
        </div>
    );

}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setSubmissionMessage: (message) => dispatch(setSubmissionMessage(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(withAuthorization(['superadmin'])(AddLinks));