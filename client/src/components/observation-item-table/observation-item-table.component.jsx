import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export default function ObservationItemTable({ observationItem }) {
    const classes = useStyles();

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Not Meeting Expectations</TableCell>
                        <TableCell>Partially Meeting Expectations</TableCell>
                        <TableCell>Meeting Expectations</TableCell>
                        <TableCell>Exceeding Expectations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    
                    {
                        observationItem ? 
                        ( 
                        <TableRow >
                            <TableCell>{observationItem.notMeetingExpecations}</TableCell>
                            <TableCell>{observationItem.partiallyMeetingExpecations}</TableCell>
                            <TableCell>{observationItem.meetingExpecations}</TableCell>
                            <TableCell>{observationItem.exceedingExpectations}</TableCell>
                        </TableRow>
                        ) : (
                            <h6>There is no data</h6>
                        )
                    }
                        
                </TableBody>
            </Table>
        </TableContainer>
    );
}
