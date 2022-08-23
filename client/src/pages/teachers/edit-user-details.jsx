import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import RegistrationFormComponent from "../../components/registration-form/registration-form.component";
import { firestore } from "../../firebase/firebase.utils";

const EditUserDetails = () => {
    const location = useLocation();
    const teacherId = location.search.split('?teacherId=')[1];

    const [staff, setStaff] = useState(null);
    const [submissionMessage, setSubmissionMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;

        if(name === 'isActive'){
            let isActive = value === 'Active' ? true : false;
            setStaff({
                ...staff,
                isActive
            });
            return;
        }

        setStaff({
            ...staff,
            [name]: value
        });
    };

    useEffect(() => {
        const fetchStaff = async () => {
            const ref = firestore.collection('users').doc(teacherId);
            const snapshot = await ref.get();

            if (snapshot.exists) {
                setStaff(snapshot.data());
            }
        }

        fetchStaff();
    }, [teacherId]);

    const updateCourses = async (id) => {
        let courses = [];

        try {
            const response = await axios.post('/canvas-courses', {
                teacherId: id,
            }
            );
            const fetchedCourses = response.data;
            courses = fetchedCourses.filter(
                course => course.enrollments[0].type === 'teacher' && !course.name.includes('SandBox')
            );
        } catch (e) {
            console.log(e.message);
        }

        setStaff({
            ...staff,
            courses: courses.map(({ name, id }) => ({ name, id }))
        });
    };

    const handleSubmit = async () => {
        if(!staff) return;

        setIsLoading(true);
        try {
            const ref = firestore.collection('users').doc(teacherId);
            await ref.set({
                ...staff,
                lastFirst: `${staff.lastName}, ${staff.firstName}`
            });
            setSubmissionMessage({
                type: 'success',
                text: 'Successfully updated staff'
            });
        } catch (error) {
            setSubmissionMessage({
                type: 'error',
                text: error.message
            });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return staff ? (
        <RegistrationFormComponent
            staff={staff}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            isLoading={isLoading}
            submissionMessage={submissionMessage}
            updateCourses={updateCourses}
            isUpdating={true}
        />
    ) : null;
};

export default EditUserDetails;