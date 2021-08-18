import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) =>  ({ 
    root: {
        marginTop: theme.spacing(2),
        '& .lesson-plan-header': {
            backgroundColor: '#009688'
        }
    },
    link: {
        textDecoration: 'none'
    }
}));

const LessonPlanTable = ({teachers, lessonPlanSummary}) => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TableContainer component={Paper}>
                    <Table stickyHeader >
                        <TableHead className="lesson-plan-header">
                            <TableRow>
                                <TableCell>Teacher</TableCell>
                                <TableCell>School</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell align="center"># of Scores</TableCell>
                                <TableCell align="center">Percent Submitted</TableCell>
                                <TableCell align="center">On Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {lessonPlanSummary.map((lesson, index) => {
                            const teacher = teachers[lesson.teacherId];
                            return ( 
                            <TableRow hover key={index}>
                                <TableCell>
                                    <Link to={`/staff/lesson-plans/${teacher.id}`} className={classes.link}>
                                        {`${teacher.firstName} ${teacher.lastName}`}
                                    </Link>
                                </TableCell>
                                <TableCell >{teacher.school}</TableCell>
                                <TableCell >{teacher.department}</TableCell>
                                <TableCell align="center">{lesson.percentSubmitted.numScores}</TableCell>
                                <TableCell align="center">{(lesson.percentSubmitted.rate).toFixed(1)}</TableCell>
                                <TableCell align="center">{(lesson.onTime.rate).toFixed(1)}</TableCell>
                            </TableRow>
                        )})
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
    );
};

export default LessonPlanTable;


