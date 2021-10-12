import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeachers } from '../../redux/teachers/teachers.selectors';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    table: {
        width: '40%',
        marginTop: theme.spacing(2),
        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        },
        flexGrow: 1,
    },
    links: {
        textDecoration: 'none',
    }
}));

const SubmittedGradePolicyChecks = ({ currentUser, currentYear, teachers }) => {
    const classes = useStyles();
    const [gradeChecks, setGradeChecks] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSubmittedGradeChecks = async () => {
            setIsLoading(true);
            const ref = firestore.doc(`gradebookChecks/${currentYear}/summary/${currentUser.id}`)
            const snapshot = await ref.get();

            if (snapshot.exists) {
                setGradeChecks(snapshot.data());
            }
            setIsLoading(false);
        };

        fetchSubmittedGradeChecks();
    }, [currentUser, currentYear]);

    return (
        <div className={classes.root}>
            <Typography variant="h5">Submitted Grades/Grade Policy Feedback</Typography>
            <Divider />
            {
                isLoading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer >
                        <Table className={classes.table} aria-label="grade-policy-check table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Teacher</TableCell>
                                    <TableCell align="center"># of Feedbacks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    gradeChecks && Object.keys(gradeChecks).map(teacherId => {
                                        const teacherName = teachers[teacherId].lastFirst;
                                        return (
                                            <TableRow key={teacherId} to={`/staff/grading-feedback/${teacherId}`} className={classes.links}>
                                                <TableCell>
                                                    <Link to={`/staff/grading-feedback/${teacherId}`} className={classes.links}>
                                                        {teacherName}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {gradeChecks[teacherId]}
                                                </TableCell>
                                            </TableRow>

                                        )
                                    }
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    teachers: selectTeachers
});

export default connect(mapStateToProps)(SubmittedGradePolicyChecks);