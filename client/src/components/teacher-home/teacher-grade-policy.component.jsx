import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
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
import CustomSelect from '../custom-select/custom-select.component';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';

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
    },
    notes: {
        width: '100%',
        minWidth: '30vw',
        backgroundColor: "inherit",
        padding: '12px 20px',
        borderRadius: '4px',
        fontSize: '14px',
    }
}));

const TeacherGradePolicyComponent = ({ teacher, currentUser, currentYear, teachersOptions, teachersMap, match, history }) => {
    const classes = useStyles();
    const [gradePolicyScores, setGradePolicyScores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getGradePolicyScores = async () => {
            setIsLoading(true);
            let fetchedScores = [];
            if(!teacher) {
                setGradePolicyScores(fetchedScores);
                return;
            }
            const teacherId = teacher.id;
            const ref = firestore.collection(`gradebookChecks/${currentYear}/${teacherId}`);
            const snapshot = await ref.get();

            if (!snapshot.empty) {
                snapshot.docs.forEach(doc => fetchedScores = [...fetchedScores, { id: doc.id, ...doc.data() }]);
            }

            setGradePolicyScores(fetchedScores);
            setIsLoading(false);
        }

        getGradePolicyScores();
    }, [teacher, currentYear]);

    const handleSelect = (e) => {
        const { value } = e.target;
        const { id } = teachersMap[value];
        history.push(match.url.replace(match.params.teacherId, id));
    };

    return (
        <>
            <Box
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Typography variant="h6">Grades/Grade Policy Feedback</Typography>
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
                            <div >
                                {
                                    gradePolicyScores.length > 0 && (
                                        gradePolicyScores.sort(
                                            (a, b) => {
                                                if (a.date.toDate() < b.date.toDate()) {
                                                    return 1;
                                                } else {
                                                    return -1;
                                                }
                                            }
                                        ).map((gradePolicyScore, index) => (
                                            <Accordion defaultExpanded={index === 0} key={index}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls={`${index}-content`}
                                                    id={`${index}-header`}
                                                >
                                                    <div>
                                                        {/* <Typography variant="h6" >Grades/Grade Policy Feedback</Typography> */}
                                                        <div>
                                                            <Typography variant="caption">{`Date & Time: ${gradePolicyScore.date.toDate().toLocaleString()}`}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="caption">
                                                                {`Submitted By: ${gradePolicyScore.observer.lastName}, ${gradePolicyScore.observer.firstName}`}
                                                            </Typography>
                                                        </div>
                                                    </div>

                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: "flex-start" }}>
                                                        <TableContainer style={{ marginTop: '10px', marginBottom: '20px' }} elevation={0} component={Paper}>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Section</TableCell>
                                                                        <TableCell align="center">Grade Policy</TableCell>
                                                                        <TableCell align="center">Assignments</TableCell>
                                                                        <TableCell align="center">Scoresheet</TableCell>
                                                                        <TableCell align="center" colSpan={8}>Notes</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {
                                                                        Object.values(gradePolicyScore.scores).map((gradePolicyFeedback, idx) => (
                                                                            <TableRow hover key={`feedback-${idx}`}>

                                                                                <TableCell>
                                                                                    {`${gradePolicyFeedback.course.course_name} - ${gradePolicyFeedback.course.section_number}`}
                                                                                </TableCell>
                                                                                <TableCell 
                                                                                align="center"
                                                                                style={{
                                                                                    backgroundColor: gradePolicyFeedback.gradePolicy === 'PM' ? '#ffffcc' : (gradePolicyFeedback.gradePolicy === 'NM' ? '#ffc2b3' : 'inherit')
                                                                                }}
                                                                                >
                                                                                    {gradePolicyFeedback.gradePolicy}
                                                                                </TableCell>
                                                                                <TableCell 
                                                                                align="center"
                                                                                style={{
                                                                                    backgroundColor: gradePolicyFeedback.assignments === 'PM' ? '#ffffcc' : (gradePolicyFeedback.assignments === 'NM' ? '#ffc2b3' : 'inherit')
                                                                                }}
                                                                                >
                                                                                    {gradePolicyFeedback.assignments}
                                                                                </TableCell>
                                                                                <TableCell 
                                                                                align="center"
                                                                                style={{
                                                                                    backgroundColor: gradePolicyFeedback.scoresheet === 'PM' ? '#ffffcc' : (gradePolicyFeedback.scoresheet === 'NM' ? '#ffc2b3' : 'inherit')
                                                                                }}
                                                                                >
                                                                                    {gradePolicyFeedback.scoresheet}
                                                                                </TableCell>
                                                                                <TableCell colSpan={8}>
                                                                                    <TextareaAutosize
                                                                                        readOnly
                                                                                        aria-label="grade policy notes"
                                                                                        className={classes.notes}
                                                                                        variant="outlined"
                                                                                        value={gradePolicyFeedback.notes}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <div>
                                                            {
                                                                currentUser.id === gradePolicyScore.observer.id ? (
                                                                <Button
                                                                    className={classes.link}
                                                                    component={Link}
                                                                    color="primary"
                                                                    variant="contained"
                                                                    to={`/grade-policy/submitted/${gradePolicyScore.id}?tid=${gradePolicyScore.teacher.id}`}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))

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

export default connect(mapStateToProps)(TeacherGradePolicyComponent);