import CircularProgress from '@material-ui/core/CircularProgress';
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

const CustomSpreadSheetTable = ({records, header, isLoading, size, maxHeight}) => { 
    const classes = useStyles();

    return (
        isLoading ? ( 
            <CircularProgress />
        ) : (
        <div className={classes.root}>
            <TableContainer component={Paper} elevation={0} style={ maxHeight ? {maxHeight: maxHeight } : null }>
                    <Table size={size} stickyHeader >
                        <TableHead >
                            <TableRow>
                                {
                                    header.map( (cell, i) => ( 
                                        <TableCell key={`header-${i}`}>{cell}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {records.map((row, i) => {
                            return ( 
                            <TableRow hover key={`row-${i}`}>
                                {
                                    row.map((cell, i) => (
                                        <TableCell key={`data-cell-${i}`}>{cell}</TableCell>
                                    ))
                                }
                            </TableRow>
                        )})
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
        )
    );
};

export default CustomSpreadSheetTable;


