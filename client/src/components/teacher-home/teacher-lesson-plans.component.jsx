import {useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';
import {selectCurrentYear} from '../../redux/school-year/school-year.selectors';
import { selectTeacher } from '../../redux/teachers/teachers.selectors';

import { CircularProgress, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

const TeacherLessonPlansComponent = ({teacher, currentYear}) => {
    const classes = useStyles();
    const [lessonPlanScore, setLessonPlanScore] = useState(null);
    const [lessonPlans, setLessonPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const teacherId = teacher.id;
        
        const getLPScores = async () => {
            const lessonPlanScoreRef = firestore.doc(`lessonPlanScores/${currentYear}/summary/${teacherId}`);
            const lessonPlanData = await lessonPlanScoreRef.get();
            let lpScore = null;

            if(lessonPlanData.exists){
                lpScore = lessonPlanData.data();
            }
            setLessonPlanScore(lpScore);
        }; 
        
        const getLessonPlans = async () => {
            const ref = firestore.collection(`lessonPlanScores/${currentYear}/${teacherId}`);
            const snapshot = await ref.get();
            let fetchedLessonPlans = [];
            if(!snapshot.empty){
                snapshot.docs.forEach(doc => fetchedLessonPlans = [...fetchedLessonPlans, doc.data()] );
            }

            setLessonPlans(fetchedLessonPlans);
        }

        setIsLoading(true);
        getLPScores();
        getLessonPlans();
        setIsLoading(false);
        
    }, [teacher, currentYear]);

    return ( 
        <>
            <Typography variant="h6">{`Lesson Plans - ${teacher.firstName} ${teacher.lastName}`}</Typography>
            <Divider />
            {
                isLoading ?
                ( 
                    <div>
                        <CircularProgress />
                    </div>
                ) : (
                    <div className={classes.root}>
                        <div>
                        {
                            lessonPlanScore && ( 
                            <Grid container>
                                <Grid xs={12} md={6} item>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell># of LP Scores</TableCell>
                                                <TableCell>Percent Submitted</TableCell>
                                                <TableCell>On Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{lessonPlanScore.percentSubmitted.numScores}</TableCell>
                                                <TableCell>{lessonPlanScore.percentSubmitted.rate.toFixed(1)}</TableCell>
                                                <TableCell>{lessonPlanScore.onTime.rate.toFixed(1)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                </Grid>
                                <Grid xs={false} md={6}></Grid>
                            </Grid>
                            )
                        }
                        </div>
                        <div style={{ marginTop: '20px'}}>
                            {
                            lessonPlans.length > 0 && (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Observer</TableCell>
                                                <TableCell>Submitted LP (%)</TableCell>
                                                <TableCell>On Time (%)</TableCell>
                                                <TableCell>Notes</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                lessonPlans.sort((a, b) => (b.date-a.date))
                                                    .map((lessonPlan, idx) => ( 
                                                    <TableRow hover key={idx}>
                                                        <TableCell>{new Date(lessonPlan.date.seconds*1000).toLocaleDateString()}</TableCell>
                                                        <TableCell>{`${lessonPlan.observer.firstName} ${lessonPlan.observer.lastName}`}</TableCell>
                                                        <TableCell>{lessonPlan.scores.average.percentSubmitted.rate.toFixed(1)}</TableCell>
                                                        <TableCell>{lessonPlan.scores.average.onTime.rate.toFixed(1)}</TableCell>
                                                        <TableCell>{lessonPlan.scores.notes}</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                            }
                        </div>
                    </div>
                )
            }
        </>
    )

}

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
    currentYear: selectCurrentYear(state)
});

export default connect(mapStateToProps)(TeacherLessonPlansComponent);