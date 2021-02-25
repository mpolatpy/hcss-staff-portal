import React, { useState, useEffect } from 'react';
import { useStyles } from './profile.styles';
import axios from 'axios';


const ProfilePage = ({ currentUser }) => {
    const classes = useStyles();
    const [courses, setCourses ] = useState([]);

    useEffect(() => {
        const handleGetCourses = () => {
            axios({
                url: 'canvas-courses',
                method: 'post',
                data: {
                    teacherId: currentUser.canvasId,
                }
            }).then(response => response.data)
                .then(courses => setCourses(courses))
                .catch((err) => {
                    console.log(err);
                });
        }
        
        handleGetCourses();
    }, [currentUser.canvasId]);    

    return ( 
        <div className={classes.profilePage}>
            <div className={classes.profileCard}>
                <h2>Name: {`${currentUser.firstName} ${currentUser.lastName}`}</h2>
                <h2>School: {currentUser.school}</h2>
                <h2>Department: {currentUser.department}</h2>
                <h2>Role: {currentUser.role}</h2>
                <h2>Username: {currentUser.displayName}</h2>
            </div>
            <div className={classes.profileCard}>
            <h2>Canvas Courses</h2>
                {
                    courses.length>0 && 
                    courses.map( (course, index) => ( 
                        <li key={index}>
                            {course.name}
                        </li>
                    ))
                }
            </div>
        </div>
    );
}

export default ProfilePage;
