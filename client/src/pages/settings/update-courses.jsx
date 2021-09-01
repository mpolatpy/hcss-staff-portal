import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectTeacherList } from '../../redux/teachers/teachers.selectors';
import axios from 'axios';
import { useStyles } from '../observations/observation-template.styles';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

 const UpdateCoursesPage = ({ teachers, currentUser }) => {
    const [selectedTeachers, setSelectedTeachers ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const classes = useStyles();
    const [submitStatus, setSubmitStatus] = useState([]);
    const [canvasTerms, setCanvasTerms] = useState([]);

    useEffect(() => {
        const getCanvasTerms = async () => {
            const snapshot = await firestore.collection('years').where('isActiveYear', '==', true).get();
            const canvasTerms = snapshot.docs[0].data().canvasTerms;
            return canvasTerms;
        };

        getCanvasTerms().then(canvasTerms => setCanvasTerms(canvasTerms));
    },[]);

    const handleChange = (e, values) => {
        setSelectedTeachers(values);
    }

    const getCourses = async (teacher) => {
        const response = await axios.post( '/canvas-courses', {
            teacherId: teacher.canvasId,
        });
        const courses = response.data.filter ( 
            course => course.enrollments[0].type === 'teacher' 
            && !course.name.includes('SandBox') 
            && canvasTerms.includes(course.enrollment_term_id)
        ).map(course => ({
            name: course.name,
            id: course.id
        }));

        return courses;
    }

    const updateCoursesForTeacher = async (teacher, submissions) => {
        try{
            const courses = await getCourses(teacher);
            const ref = firestore.doc(`users/${teacher.firestoreId}`);
            await ref.update({courses: courses});
            submissions.push(`Updated courses for ${teacher.firstName} ${teacher.lastName}: `);
            courses.forEach((course, i) => submissions.push(`${i+1}: ${course.name} `));
        } catch(e){
            submissions.push(`Not updated courses for ${teacher.firstName} ${teacher.lastName}: ${e.message}`);
        }
        submissions.push('________________________________________________________ ');
        
        return submissions;  
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        let submissions = [];
        for(let teacher of selectedTeachers){
            submissions = await updateCoursesForTeacher(teacher, submissions);
        }

        setSubmitStatus(submissions);
        setIsLoading(false);
        setShowReport(true);
    }

    return (
        isLoading ?
        (
            <div className={classes.loading}>
                <CircularProgress />
            </div>
        ):
        (showReport ?
        ( 
            <div style={{ marginTop: '10px' }}>
                    {
                        submitStatus.map((submission, i) => (
                            <p key={`submission-${i}`}>{submission}</p>
                        ))
                    }
            </div>
        ):
        (
        <div className={classes.root}>
            <Typography variant="h5">Update Courses for Selected Teachers</Typography>  
            <Divider/>
            <div className={classes.items}>
                <Autocomplete
                multiple
                getOptionSelected={(option, value) => option.id === value.id}
                value={selectedTeachers}
                id="selected-observation-templates"
                options={teachers}
                fullWidth
                disableCloseOnSelect
                onChange={handleChange}
                getOptionLabel={(option) => `${option.lastName}, ${option.firstName}`}
                renderOption={(option, { selected }) => (
                    <React.Fragment>
                    <Checkbox
                        icon={icon}
                        name={option.id}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    { `${option.lastName}, ${option.firstName}`}
                    </React.Fragment>
                )}
                renderInput={(params) => (
                    <TextField {...params}  label="Select Teachers to Update Courses" placeholder=""/>
                )}
                />
            </div>
            <div className={classes.items}>
                <Button variant="outlined" color="primary" onClick={handleSubmit}>Update Courses</Button>    
            </div>
        </div>
        ))
    );
}

const mapStateToProps = createStructuredSelector({
    teachers: selectTeacherList,
    currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(UpdateCoursesPage);
