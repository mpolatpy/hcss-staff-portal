import { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import {connect} from 'react-redux';
import { createStructuredSelector } from "reselect";
import { selectCurrentYear } from "../../redux/school-year/school-year.selectors";
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { MenuItem, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { calculateAverageScores, calculateUpdatedLPScore } from "../../components/lesson-plan-content/lesson-plan-content-utils";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        },
        flexGrow: 1,
        marginTop: '20px'
    },
}); 


const LessonPlanEditPage = ({match, history, location, currentYear, setSubmissionMessage}) => {
    const lessonPlanId = match.params.lessonPlanId;
    const teacherId = location.search.split('?tid=')[1];
    const classes = useStyles();
    const [ isFetching, setIsFetching ] = useState(false);
    const [ lessonPlanScores, setLessonPlanScores ] = useState(null);
    const [ previousScores, setPreviousScores ] = useState(null);
    const [teacher, setTeacher ] = useState('');
    const [observer, setObserver ] = useState(null);
    const [date, setDate ] = useState(null);
    const [editDate, setEditDate ] = useState(null);

    useEffect(() =>{
        const getLessonPlanScore = async () => {
            setIsFetching(true);
            const snapshot = await firestore.doc(`lessonPlanScores/${currentYear}/${teacherId}/${lessonPlanId}`).get();
            if(!snapshot.exists) return;
            const {scores, teacher, observer, date, editDate} = snapshot.data();
            
            setLessonPlanScores(scores);
            setPreviousScores(scores);
            setTeacher(teacher);
            setObserver(observer);
            setDate(date.toDate());
            setIsFetching(false);
            if(editDate) setEditDate(editDate.toDate());
        }
        getLessonPlanScore();
    },[]);

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

    const handleSubmit = async () => {
        const lessonPlan = {
            teacher,
            observer,
            date,
            scores: lessonPlanScores,
            editDate: new Date()
        };

        const lessonPlanRef = firestore.doc(`lessonPlanScores/${currentYear}/${teacherId}/${lessonPlanId}`);
        const lessonPlanScoreRef = firestore.doc(`lessonPlanScores/${currentYear}/summary/${teacherId}`);
        

        try{
            const aveScoreSnapshot = await lessonPlanScoreRef.get();
            const lessonPlanAveScore = aveScoreSnapshot.data();
            const previousScore = previousScores.average;
            const newScore = lessonPlan.scores.average;

            const updatedScore = calculateUpdatedLPScore(newScore, previousScore, lessonPlanAveScore);
            firestore.runTransaction(async transaction => {
                transaction.set(lessonPlanRef, lessonPlan);
                transaction.set(lessonPlanScoreRef, updatedScore);
            });
            setSubmissionMessage({
                content: `Successfully updated lesson plan check for ${teacher.firstName} ${teacher.lastName}`,
                status: 'success'
            });
        } catch(e){
            console.log(e);
            setSubmissionMessage({
                content: e.message,
                status: 'error'
            });
        }
        history.push(`/lesson-plans/submitted`);
    }

    return ( 
        <>
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
            <Typography variant="h5" >
                {`Lesson Plan Check - ${teacher.firstName} ${teacher.lastName}`}
            </Typography>
            {
                date && (
                    <Typography variant="caption">
                        {`Submitted on: ${date.toLocaleString()}`}
                    </Typography>
                )
            }
            {
                editDate && (
                    <Typography variant="caption" display="block" >
                        {`Last edited on: ${editDate.toLocaleString()}`}
                    </Typography>
                )
            }
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
                { lessonPlanScores && Object.keys(lessonPlanScores.courses).length > 0 ? 
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
                            value={lessonPlanScores && lessonPlanScores.notes || ''}
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
                    lessonPlanScores && lessonPlanScores.average && (
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

const mapStateToProps = createStructuredSelector({
    currentYear: selectCurrentYear
});

const mapDispatchToProps = (dispatch) => ({
    setSubmissionMessage: (message) => dispatch(setSubmissionMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LessonPlanEditPage));
