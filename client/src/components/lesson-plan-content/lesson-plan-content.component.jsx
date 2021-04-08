import React, { useEffect, useState} from 'react';
import axios from 'axios';

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
import { MenuItem } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Content = ({teacher, submitLessonPlanCheck, observer, currentYear, teachers }) => {
    const classes = useStyles();
    const [isFetching, setIsFetching ] = useState(false);
    const [lessonPlanScores, setLessonPlanScores ] = useState({});

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
                
                const initialScores = {};
                teacherCourses.forEach(course => {
                    initialScores[course.id] = {
                        course: course.name,
                        percentSubmitted: '',
                        onTime: ''
                    }
                });

                setLessonPlanScores(initialScores);

            }catch(e){
                console.log(e.message);
            }
        };
        
        getCourses().then(() => setIsFetching(false));

    }, [teacher.canvasId]);

    const handleSubmit = async () => {
        await submitLessonPlanCheck({
            teacher: teacher,
            observer: observer,
            date: new Date(),
            scores: lessonPlanScores,
        }, currentYear, teachers);

        setLessonPlanScores({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(name.includes('percent')){
            const courseId = name.split('percent')[0];
            setLessonPlanScores({
                ...lessonPlanScores,
                [courseId]: {
                    ...lessonPlanScores[courseId],
                    percentSubmitted: parseInt(value)
                } 
            });
        } else if(name.includes('onTime')){
            const courseId = name.split('onTime')[0];
            setLessonPlanScores({
                ...lessonPlanScores,
                [courseId]: {
                    ...lessonPlanScores[courseId],
                    onTime: value
                } 
            });
        }
    }

    return ( 
        <>
            <h2>{`Lesson Plan Check for ${teacher.firstName} ${teacher.lastName}`}</h2>
            {/* <Divider/> */}

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
                <form>
                    <div>
                    <TableContainer>
                        <Table className={classes.table} aria-label="lesson-plan-check table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Course</TableCell>
                                    <TableCell align="center">% of LP Submitted</TableCell>
                                    <TableCell align="center">On Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                (Object.keys(lessonPlanScores).length > 0) ? 
                                Object.keys(lessonPlanScores).map( 
                                    courseId => ( 
                                    <TableRow hover key={courseId}>
                                        <TableCell component="th" scope="row">
                                            <a href={`https://hcss.instructure.com/courses/${courseId}`} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {lessonPlanScores[courseId].course}
                                            </a>
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField 
                                                variant="outlined"
                                                size="small"
                                                style={{ width: '100px' }}
                                                onChange={handleChange}
                                                name={`${courseId}percent`}
                                                value={lessonPlanScores[courseId].percentSubmitted}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                            select
                                            style={{ width: '100px'}}
                                            size="small"
                                            variant="outlined"
                                            onChange={handleChange}
                                            value={lessonPlanScores[courseId].onTime}
                                            name={`${courseId}onTime`}
                                            >
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </TextField>
                                            
                                        </TableCell>
                                    </TableRow>
                                )
                                ) : null
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
                        {/* {(courses && courses.length > 0) ? courses.map( 
                            course => ( 
                                <div>
                                    <a href={`https://hcss.instructure.com/courses/${course.id}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={course.id}>
                                        <h4>{course.name}</h4>
                                    </a>   
                              </div>
                            )
                        ) : null} */}
                    </div>
                    <div style={{ marginTop: '25px'}}>
                        <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
                    </div>
                </form>
                </>
            )
            }
        </>
    );
}

export default Content;