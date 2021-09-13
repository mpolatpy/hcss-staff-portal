import Typography from "@material-ui/core/Typography";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>  ({ 
    root: {
        width: '55vw',
        marginTop: theme.spacing(2),
        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        }   
    },
    link: {
        textDecoration: 'none'
    }
}));

const TeacherScheduleTable = ({schedule, teacher}) => {
    const days = [['A', 'Mon'], ['B','Tue'], ['C','Wed'], ['D','Thu'], ['E','Fri']];
    const blocks = ['B1', 'B2', 'B3', 'B4', 'B5', 'SH'];
    const classes = useStyles();

    return ( 
        <div className={classes.root}>
            <Typography variant="h6">{`Weekly Schedule - ${teacher.firstName} ${teacher.lastName}`}</Typography>
            <TableContainer component={Paper}>
                <Table stickyHeader >
                    <TableHead >
                        <TableRow>
                            <TableCell>Days</TableCell>
                            {
                                blocks.map( (block, i) => (
                                    <TableCell key={`block-${i}`}>{block}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            days.map( day => (
                                <TableRow hover key={`day-${day[0]}`}>
                                    <TableCell>{day[1]}</TableCell>
                                    {
                                        schedule[day[0]].map( (block, j) => (
                                            <TableCell key={`block-${day[0]}-${j}`}>
                                                <>
                                                    <Typography variant="body2">{`${block.course_name || ''} - ${block.section_number || ''}`}</Typography>
                                                    <Typography variant="body2">{block.room ? `Room: ${block.room}` : ''}</Typography>
                                                </>
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )

};

export default TeacherScheduleTable;