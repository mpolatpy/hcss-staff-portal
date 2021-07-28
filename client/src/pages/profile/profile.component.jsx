import React, { useState, useEffect } from 'react';
import { useStyles } from './profile.styles';
import axios from 'axios';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

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
                <Typography variant="h5">Account Details</Typography>
                <Divider style={{width:'100%', marginBottom:'20px'}}/>
                <Typography variant="subtitle1">Name: {`${currentUser.firstName} ${currentUser.lastName}`}</Typography>
                <Typography>School: {currentUser.school}</Typography>
                <Typography>Department: {currentUser.department}</Typography>
                <Typography>Role: {currentUser.role}</Typography>
                <Typography>Username: {currentUser.displayName}</Typography>
            </div>
            <div className={classes.profileCard}>
                <Typography variant="h5">Courses</Typography>
                <Divider style={{width:'100%', marginBottom:'20px'}}/>
                {
                    courses.length>0 && 
                    courses.filter ( course => course.enrollments[0].type === 'teacher')
                    .map( (course, index) => ( 
                        <a href={`https://hcss.instructure.com/courses/${course.id}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                        >
                            <Typography>{course.name}</Typography>
                        </a>
                    ))
                }
            </div>
        </div>
    );
}

export default ProfilePage;
