import { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";
import { selectCurrentYear } from "../../redux/school-year/school-year.selectors";
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import { selectTeachers } from "../../redux/teachers/teachers.selectors";
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
    notes: {
        width: '100%',
        minWidth: '30vw',
        backgroundColor: "inherit",
        padding: '12px 20px',
        borderRadius: '4px',
        fontSize: '14px',
    }
});


const GradePolicyEditPage = ({ match, history, location, currentYear, setSubmissionMessage, teachers }) => {
    const gradeCheckId = match.params.gradeCheckId;
    const teacherId = location.search.split('?tid=')[1];
    const teacher = teachers[teacherId];
    const classes = useStyles();

    const [isFetching, setIsFetching] = useState(false);
    const [gradePolicyScores, setGradePolicyScores] = useState(null);
    const [observer, setObserver] = useState(null);
    const [date, setDate] = useState(null);
    const [editDate, setEditDate] = useState(null);

    useEffect(() => {
        const getGradepolicyCheck = async () => {
            setIsFetching(true);
            const snapshot = await firestore.doc(`gradebookChecks/${currentYear}/${teacherId}/${gradeCheckId}`).get();
            if (!snapshot.exists) return;
            const { scores, teacher, observer, date, editDate } = snapshot.data();

            setGradePolicyScores(scores);
            setObserver(observer);
            setDate(date.toDate());
            setIsFetching(false);
            if (editDate) setEditDate(editDate.toDate());

            return teacher;
        };

        getGradepolicyCheck();

    }, [currentYear, gradeCheckId, teacherId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section_id, property] = name.split('-');

        setGradePolicyScores({
            ...gradePolicyScores,
            [section_id]: {
                ...gradePolicyScores[section_id],
                [property]: value
            }
        });

    }

    const handleSubmit = async () => {
        const ref = firestore.doc(`gradebookChecks/${currentYear}/${teacherId}/${gradeCheckId}`);
        const notificationRef = firestore.collection(`notifications`).doc(currentYear).collection(teacher.id).doc();

        try{
            await firestore.runTransaction(async (transaction) => {
                transaction.update(ref, {
                    scores: gradePolicyScores,
                    editDate: new Date()
                });
                transaction.set(notificationRef, {
                    message: 'Notification - Updated Grades/Grade Policy Feedback',
                    display: true,
                    date: date,
                    viewLink: `/staff/grading-feedback/${teacher.id}`
                });
            });
            setSubmissionMessage({
                content: `Successfully updated feedback for ${teacher.firstName} ${teacher.lastName}`,
                status: 'success'
            });
        } catch(e) {
            console.log(e);
            setSubmissionMessage({
                content: e.message,
                status: 'error'
            });
        }
        history.push(`/grade-policy/submitted`);
    };

    return (
        <>
            {
                isFetching ?
                    (
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <>
                            <div>
                                <Typography variant="h5" >
                                    {`Grades/Grade Policy Feedback - ${teacher.firstName} ${teacher.lastName}`}
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
                                    <Table className={classes.table} aria-label="grade-policy-check table">
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
                                                gradePolicyScores && Object.keys(gradePolicyScores).length > 0 ?
                                                    Object.keys(gradePolicyScores).map(section_id => {
                                                        const { course_name, dcid, no_of_students, termid, section_number } = gradePolicyScores[section_id].course;

                                                        return (
                                                            <TableRow hover key={section_id}>
                                                                <TableCell component="th" scope="row">
                                                                    <a href={`https://hcss.powerschool.com/admin/powerteacher/index.html?frn=005${dcid}#/?sectionId=${section_id}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ textDecoration: 'none' }}
                                                                    >
                                                                        {`${course_name} - ${section_number}`}
                                                                    </a>
                                                                </TableCell>
                                                                {/* <TableCell align="center">{termid}</TableCell> */}
                                                                {/* <TableCell align="center" className={classes.numStudents}>{no_of_students}</TableCell> */}

                                                                <TableCell align="center">
                                                                    <TextField
                                                                        select
                                                                        style={{
                                                                            width: '100px',
                                                                            backgroundColor: gradePolicyScores[section_id].gradePolicy === 'PM' ? '#ffffcc' : (gradePolicyScores[section_id].gradePolicy === 'NM' ? '#ffc2b3' : 'inherit')
                                                                        }}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onChange={handleChange}
                                                                        value={gradePolicyScores[section_id].gradePolicy}
                                                                        name={`${section_id}-gradePolicy`}
                                                                    >
                                                                        <MenuItem value=""></MenuItem>
                                                                        <MenuItem value="M">M</MenuItem>
                                                                        <MenuItem value="PM">PM</MenuItem>
                                                                        <MenuItem value="NM">NM</MenuItem>
                                                                    </TextField>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        select
                                                                        style={{
                                                                            width: '100px',
                                                                            backgroundColor: gradePolicyScores[section_id].assignments === 'PM' ? '#ffffcc' : (gradePolicyScores[section_id].assignments === 'NM' ? '#ffc2b3' : 'inherit')
                                                                        }}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onChange={handleChange}
                                                                        value={gradePolicyScores[section_id].assignments}
                                                                        name={`${section_id}-assignments`}
                                                                    >
                                                                        <MenuItem value=""></MenuItem>
                                                                        <MenuItem value="M">M</MenuItem>
                                                                        <MenuItem value="PM">PM</MenuItem>
                                                                        <MenuItem value="NM">NM</MenuItem>
                                                                    </TextField>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        select
                                                                        style={{
                                                                            width: '100px',
                                                                            backgroundColor: gradePolicyScores[section_id].scoresheet === 'PM' ? '#ffffcc' : (gradePolicyScores[section_id].scoresheet === 'NM' ? '#ffc2b3' : 'inherit')
                                                                        }}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onChange={handleChange}
                                                                        value={gradePolicyScores[section_id].scoresheet}
                                                                        name={`${section_id}-scoresheet`}
                                                                    >
                                                                        <MenuItem value=""></MenuItem>
                                                                        <MenuItem value="M">M</MenuItem>
                                                                        <MenuItem value="PM">PM</MenuItem>
                                                                        <MenuItem value="NM">NM</MenuItem>
                                                                    </TextField>
                                                                </TableCell>
                                                                <TableCell colSpan={8}>
                                                                    <TextareaAutosize
                                                                        aria-label="lesson plan notes"
                                                                        className={classes.notes}
                                                                        variant="outlined"
                                                                        onChange={handleChange}
                                                                        value={gradePolicyScores[section_id].notes}
                                                                        name={`${section_id}-notes`}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        )

                                                    }
                                                    ) : null
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div style={{ marginTop: '15px' }}>
                                <Button onClick={handleSubmit} color="primary" variant="contained" >Submit</Button>
                            </div>
                        </>
                    )
            }
        </>
    );
};

const mapStateToProps = createStructuredSelector({
    currentYear: selectCurrentYear,
    teachers: selectTeachers
});

const mapDispatchToProps = (dispatch) => ({
    setSubmissionMessage: (message) => dispatch(setSubmissionMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GradePolicyEditPage));
