import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import RegistrationForm from '../../components/registration-form/registration-form.component';
import WithAuthorization from '../../components/with-authorization/withAuthorization.component';
import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';

const UserRegistrationPage = (props) => {
    
    const [staff, setStaff] = useState({
        firstName:'',
        lastName:'',
        email: '',
        password: '',
        school: '',
        role: '',
        jobTitle: '',
        department: '',
        courses: [],
        submissionMessage: null
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setStaff({
            ...staff,
            [name]: value
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const { firstName, lastName, email, password, school, role,  department, courses} = staff;

        try {
            setIsLoading(true);

            const { user } = await auth.createUserWithEmailAndPassword(
                email,
                password
            );

            await createUserProfileDocument(user, 
                { firstName, lastName, school, role, department, courses });

            setStaff({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                school: '',
                role: '',
                jobTitle: '',
                department: '',
                courses: [],
                submissionMessage: {
                    type: 'success',
                    text: 'User saved successfully.'
                }
            });
            
        } catch (error) {
            setStaff({
                ...staff,
                submissionMessage: {
                    type: 'error',
                    text: error.message
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return ( 
        <div>
            <RegistrationForm 
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                staff={staff}
                isLoading={isLoading}
            />
        </div>
    );

}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(UserRegistrationPage);