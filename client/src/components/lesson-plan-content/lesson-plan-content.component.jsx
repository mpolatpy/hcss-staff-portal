import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { MenuItem } from '@material-ui/core';
import { calculateAverageScores } from './lesson-plan-content-utils';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    '& .MuiTableCell-head': {
        backgroundColor: '#3f51b5',
        color: '#fff'
    },
    flexGrow: 1,
  },
}); 

const Content = ({teacher, submitLessonPlanCheck, observer, currentYear, teachers, setSubmissionMessage }) => {
    const classes = useStyles();
    const [ isFetching, setIsFetching ] = useState(false);
    const [ lessonPlanScores, setLessonPlanScores ] = useState({
        courses: {},
        notes: ''
    });
    
    useEffect(() => {
        setIsFetching(true);
        const getCourses = async () => {
            let teacherCourses =[];

            try{
                const snapshot = await firestore.collection('years').where('isActiveYear', '==', true).get();
                const canvasTerms = snapshot.docs[0].data().canvasTerms;
                const response = await axios.post('/canvas-courses', {
                        teacherId: teacher.canvasId,
                    }
                );
                const fetchedCourses  = response.data;
                teacherCourses = fetchedCourses.filter ( 
                    course => 
                    course.enrollments[0].type === 'teacher' 
                    && !course.name.includes('SandBox')
                    && canvasTerms.includes(course.enrollment_term_id)
                ); 
                
                const initialScores = {};
                teacherCourses.forEach(course => {
                    initialScores[course.id] = {
                        course: course.name,
                        id: course.id,
                        percentSubmitted: '',
                        onTime: ''
                    }
                });

                setLessonPlanScores({
                    courses: initialScores,
                    average: {
                        percentSubmitted: {
                            rate: 0,
                            numScores: 0
                        }, 
                        onTime: {
                            rate: 0,
                            numScores: 0
                        }, 
                    }
                });
            }catch(e){
                console.log(e.message);
            }
        };
        
        getCourses().then(() => setIsFetching(false));

    }, [teacher.canvasId]);

    const handleSubmit = async () => {

        const lessonPlan = {
            teacher: teacher,
            observer: observer,
            date: new Date(),
            scores: lessonPlanScores,
        };

        try{
            await submitLessonPlanCheck(lessonPlan, currentYear, teachers);
            setSubmissionMessage({
                content: `Successfully submitted lesson plan check for ${teacher.firstName} ${teacher.lastName}`,
                status: 'success'
            });
        } catch(e){
            setSubmissionMessage({
                content: e.message,
                status: 'error'
            });
        }
    };

    const handleNoteChange = (e) => {
        const { value } = e.target;

        setLessonPlanScores({
            ...lessonPlanScores,
            notes: value
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let courseId, field, averageScore;

        if(isNaN(value) || value === ' '){
            alert('Please enter numbers only');
            return;
        }

        if(name.includes('percent')){
            courseId = name.split('percent')[0];
            field = 'percentSubmitted';
        } else if(name.includes('onTime')){
            courseId = name.split('onTime')[0];
            field = 'onTime'
        }

        averageScore = calculateAverageScores(field, value, courseId, lessonPlanScores);

        setLessonPlanScores({
            ...lessonPlanScores,
            courses: {
                ...lessonPlanScores.courses,
                [courseId]: {
                    ...lessonPlanScores.courses[courseId],
                    [field]: value
                } 
            },
            average: {
                ...lessonPlanScores.average,
                [field]: averageScore
            }
        });
            
    }

    return ( 
        <>
            <h2>{`Lesson Plan Check - ${teacher.firstName} ${teacher.lastName}`}</h2>
            { 
            isFetching?
            ( 
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                 }}>
                    <CircularProgress/> 
                </div>
            ): (
                <>
                <div>
                <TableContainer >
                <Table className={classes.table} aria-label="lesson-plan-check table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Course</TableCell>
                            <TableCell align="center">% of LP Submitted</TableCell>
                            <TableCell align="center">On Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    { Object.keys(lessonPlanScores.courses).length > 0 ? 
                        Object.keys(lessonPlanScores.courses).map( courseId => ( 
                            <TableRow hover key={courseId}>
                                <TableCell component="th" scope="row">
                                    <a href={`https://hcss.instructure.com/courses/${courseId}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {lessonPlanScores.courses[courseId].course}
                                    </a>
                                </TableCell>
                                <TableCell align="center">
                                    <TextField 
                                        variant="outlined"
                                        size="small"
                                        style={{ width: '100px' }}
                                        onChange={handleChange}
                                        name={`${courseId}percent`}
                                        value={lessonPlanScores.courses[courseId].percentSubmitted}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                    select
                                    style={{ width: '100px'}}
                                    size="small"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={lessonPlanScores.courses[courseId].onTime}
                                    name={`${courseId}onTime`}
                                    >
                                        <MenuItem value="100">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                    </TextField>
                                </TableCell>
                            </TableRow>
                                )
                            ): null
                        }
                        <TableRow>
                            <TableCell colSpan={3}>
                                <TextareaAutosize
                                aria-label="lesson plan notes" 
                                rowsMin={4}
                                // readOnly={readOnly}
                                placeholder="Lesson Plan Notes"
                                style={{ 
                                    width: '100%',
                                    backgroundColor: "inherit",
                                    padding: '12px 20px',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                                variant="outlined"
                                onChange={handleNoteChange}
                                value={lessonPlanScores.notes}
                                name={`notes`}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
                </div>
                <div>
                    <h4 style={{marginBottom: '0px'}}>Weekly Average Score</h4>
                    {
                        lessonPlanScores.average && (
                        <div style={{ display:'flex', marginTop:'0px' }}>
                            <p>{`Percent Submitted: ${Math.round(lessonPlanScores.average.percentSubmitted.rate)} %`}</p>
                            <p style={{marginLeft:'20px'}}>{`On Time: ${Math.round(lessonPlanScores.average.onTime.rate)} %`}</p>
                        </div>)
                    }
                </div>
                <div style={{ marginTop: '15px'}}>
                    <Button onClick={handleSubmit} color="primary" variant="contained" >Submit</Button>
                </div>
                </>
            )
            }
        </>
    );
}; 



const mapDispatchToProps = (dispatch) => ({
    setSubmissionMessage: (message) => dispatch(setSubmissionMessage(message))
});

export default connect(null, mapDispatchToProps)(Content);