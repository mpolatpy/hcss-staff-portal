import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import axios from 'axios';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import VerticalTabs from '../../components/vertical-tabs/vertical-tabs-component';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const Content = ({teacher}) => {
    
    const [courses, setCourses ] = useState([]);
    const [isFetching, setIsFetching ] = useState(false);

    useEffect(() => {
        setIsFetching(true);
        const getCourses = async () => {
            let teacherCourses =[];
    
            try{
                const response = await axios.post('/canvas-courses', {
                        teacherId: teacher.canvasId,
                    }
                );
                const fetchedCourses  = response.data;
                teacherCourses = fetchedCourses.filter ( 
                    course => course.enrollments[0].type === 'teacher' && !course.name.includes('SandBox')
                ); 
            }catch(e){
                console.log(e.message);
            }
            setCourses(teacherCourses);
        };
        
        getCourses().then(() => setIsFetching(false));

    }, [teacher.canvasId]);

    return ( 
        <>
            <h2>{`Lesson Plan Check for ${teacher.firstName} ${teacher.lastName}`}</h2>
            <Divider/>

            { 
            isFetching?
            ( 
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'center', 
                 }}>
                    <CircularProgress/> 
                </div>
            ): (
                (courses && courses.length > 0) ? courses.map( 
                    course => ( 
                        <a href={`https://hcss.instructure.com/courses/${course.id}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            key={course.id}>
                            <h4>{course.name}</h4>
                        </a>
                    )
                ) : null
            )
            }
        </>
    );
}

const LessonPlanCheckPage = ({ currentUser }) => {

    const [selectedTeachers, setSelectedTeachers ] = useState([]);

    useEffect(() => {
        const fetchSelectedTeachers = async () => {
            const ref = firestore.doc(`observationTemplates/${currentUser.id}`);
            const snapshot = await ref.get();

            if (snapshot.exists){
                const fetchedData = snapshot.data();
                if(Object.keys(fetchedData).includes('teachers')){
                    setSelectedTeachers(fetchedData.teachers)
                }
            }
        };

        fetchSelectedTeachers();
    }, [currentUser.id]);

    const labels = selectedTeachers.map( 
        teacher =>  `${teacher.lastName} ${teacher.firstName}`
    );

    const contents = selectedTeachers.map( 
        (teacher, index) => ( 
            <Content key={index} teacher={teacher}/>
        )
    );

    return ( 
        <div>
            {
                selectedTeachers.length > 0 ?
                (
                    <VerticalTabs labels={labels} contents={contents}/>
                ):( 
                    <div>
                        <h2>There is no selected teachers</h2>
                        <Button color="primary" variant="contained" component={Link} to="/observations/templates/edit">Edit Selections</Button>
                    </div>
                    
                )
            }
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(LessonPlanCheckPage);

