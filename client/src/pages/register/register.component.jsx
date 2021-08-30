import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import RegistrationForm from '../../components/registration-form/registration-form.component';
import WithAuthorization from '../../components/with-authorization/withAuthorization.component';
import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';
import { sendRegistrationEmail } from '../../firebase/email-templates';

const UserRegistrationPage = () => {
    
    const [staff, setStaff] = useState({
        firstName:'',
        lastName:'',
        email: '',
        password: '',
        school: '',
        role: '',
        jobTitle: '',
        department: '',
        canvasId:'',
        powerSchoolId: '',
        courses: [],
    });

    const [submissionMessage, setSubmissionMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setStaff({
            ...staff,
            [name]: value
        });
    };

    
    const updateCourses = async (id) => {
        let courses =[];

        try{
            const response = await axios.post('/canvas-courses', {
                    teacherId: id,
                }
            );
            const fetchedCourses  = response.data;
            courses = fetchedCourses.filter ( 
                course => course.enrollments[0].type === 'teacher' && !course.name.includes('SandBox')
            ); 
        }catch(e){
            console.log(e.message);
        }

        setStaff({
            ...staff,
            courses: courses.map(({name, id}) => ({name, id}))
        }); 
    };

    

    const handleSubmit = async event => {
        event.preventDefault(); 
        const { firstName, lastName, email, password, ...otherDetails} = staff;
        let status;
        try {
            setIsLoading(true);
            const { user } = await auth.createUserWithEmailAndPassword(
                email,
                password
            );
            await createUserProfileDocument(user, 
                { firstName, lastName, ...otherDetails });
            
            await sendRegistrationEmail(email, password, firstName, lastName);
            // setIsLoading(false);
            status = 'success';
        } catch (error) {
            setSubmissionMessage({
                type: 'error',
                text: error.message
            });
            setIsLoading(false);
            status = 'error';
        } finally{
            if(status === 'success') auth.signOut();
        }
    };

    return ( 
        <div>
            <RegistrationForm 
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                staff={staff}
                isLoading={isLoading}
                submissionMessage={submissionMessage}
                updateCourses={updateCourses}
            />
        </div>
        
    );

}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(WithAuthorization(['superadmin'])(UserRegistrationPage));