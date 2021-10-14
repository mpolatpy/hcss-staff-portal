import React from 'react';
import { connect } from 'react-redux';
import { updateGradePolicyCheck } from '../../redux/grade-policy/grade-policy.actions';
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

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        },
        flexGrow: 1,
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

const GradePolicyCheckContent = ({ teacher, isLoading, gradePolicyScores, submitGradePolicyCheck, observer,
    updateGradePolicyCheck, currentYear, teachers, setSubmissionMessage }) => {
    console.log(teacher)
    const classes = useStyles();
    const teacherName = teacher.lastFirst;

    const handleSubmit = async () => {
        const gradePolicyCheck = {
            teacher: teacher,
            observer: observer,
            date: new Date(),
            scores: gradePolicyScores,
        };

        try {
            await submitGradePolicyCheck(gradePolicyCheck, currentYear, teachers);
            setSubmissionMessage({
                content: `Successfully submitted grade policy feedback for ${teacher.firstName} ${teacher.lastName}`,
                status: 'success'
            });
        } catch (e) {
            setSubmissionMessage({
                content: e.message,
                status: 'error'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section_id, property] = name.split('-');
        updateGradePolicyCheck({
            teacherName,
            section_id,
            property,
            value
        });
    }


    return (
        <>
            <h2>{`Grades/Grade Policy Check - ${teacher.firstName} ${teacher.lastName}`}</h2>
            {
                isLoading ?
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
                                <TableContainer >
                                    <Table size="small" className={classes.table} aria-label="grade-policy-check table">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>Course</TableCell> */}
                                                <TableCell>Section</TableCell>
                                                {/* <TableCell align="center">Term</TableCell> */}
                                                {/* <TableCell align="center" className={classes.numStudents}># of Students</TableCell> */}
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

const mapDispatchToProps = (dispatch) => ({
    setSubmissionMessage: (message) => dispatch(setSubmissionMessage(message)),
    updateGradePolicyCheck: (gradeCheckData) => dispatch(updateGradePolicyCheck(gradeCheckData))
});

export default connect(null, mapDispatchToProps)(GradePolicyCheckContent);