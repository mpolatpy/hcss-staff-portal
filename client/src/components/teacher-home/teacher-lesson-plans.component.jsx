import {useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';
import {selectCurrentYear} from '../../redux/school-year/school-year.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectTeacher, selectTeacherOptions, selectTeachersObjWithNameKeys } from '../../redux/teachers/teachers.selectors';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid'
import CustomSelect from '../custom-select/custom-select.component';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(2),

        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        }
    },
    link: {
        textDecoration: 'none',
    }
}));

const TeacherLessonPlansComponent = ({teacher, currentUser, currentYear, teachersOptions, teachersMap, match, history}) => {
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
                snapshot.docs.forEach(doc => fetchedLessonPlans = [...fetchedLessonPlans, {id: doc.id, ...doc.data()}] );
            }

            setLessonPlans(fetchedLessonPlans);
        }

        setIsLoading(true);
        getLPScores();
        getLessonPlans();
        setIsLoading(false);
    }, [teacher, currentYear]);

    const handleSelect = (e) => {
        const {value} = e.target;
        const {id} = teachersMap[value];
        history.push(match.url.replace(match.params.teacherId, id));
    };

    return ( 
        <>
            <Box
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
            >
                <Typography variant="h6">{`Lesson Plans - ${teacher.firstName} ${teacher.lastName}`}</Typography>
                {
                    currentUser && currentUser.role !== 'teacher' && ( 
                        <CustomSelect
                            label="Selected Teacher"
                            style={{ width: 100, height: 40 }}
                            options={teachersOptions}
                            name="selectTeacher"
                            value={`${teacher.lastName}, ${teacher.firstName}`}
                            handleSelect={handleSelect}
                        />
                    )
                }
            </Box>
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
                                <Grid xs={false} md={6} item></Grid>
                            </Grid>
                            )
                        }
                        </div>
                        <div >
                            {
                            lessonPlans.length > 0 && (
                                <TableContainer style={{ marginTop: '20px', marginBottom: '50px'}} component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date & Time</TableCell>
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
                                                        {
                                                            currentUser.id === lessonPlan.observer.id ? (
                                                                <TableCell>
                                                                    <Link 
                                                                    className={classes.link}
                                                                    to={`/lesson-plans/submitted/${lessonPlan.id}?tid=${lessonPlan.teacher.id}`}
                                                                    >
                                                                        {lessonPlan.date.toDate().toLocaleString()}
                                                                    </Link>
                                                                </TableCell>
                                                            ):(
                                                                <TableCell>
                                                                    {lessonPlan.date.toDate().toLocaleString()}
                                                                </TableCell>
                                                            )
                                                        }
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
    teachersOptions: selectTeacherOptions(state),
    teachersMap: selectTeachersObjWithNameKeys(state),
    currentYear: selectCurrentYear(state),
    currentUser: selectCurrentUser(state)
});

export default connect(mapStateToProps)(TeacherLessonPlansComponent);