import { useEffect, useState } from 'react';
import { firestore } from '../../firebase/firebase.utils';
import axios from "axios";
import { filterCurrentUserData, mapRow } from './spreadsheet-table.utils';

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

const SpreadSheetTable = ({spreadSheetInfoRef, currentUser}) => { 
    const classes = useStyles();

    const [records, setRecords ] = useState([]);
    const [header, setHeader ] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSpreadSheetInfo = async () => {
            let spreadSheetInfo = null;
            const ref = firestore.doc(spreadSheetInfoRef);
            const snapshot = await ref.get();
            
            if(snapshot.exists) spreadSheetInfo = snapshot.data();
            return spreadSheetInfo;
        };

        const fetchData = async () => {
            setLoading(true);
            const spreadSheetInfo = await fetchSpreadSheetInfo();
            if(!spreadSheetInfo ) {
                setLoading(false);
                return;
            }

            const { spreadsheetId, range, columns, filterColumn, filterProperty } = spreadSheetInfo;

            try{
                const response = await axios.post('/read-google-sheets-data', {
                    options: {
                        spreadsheetId,
                        range,
                    }
                });

                if(response.data && response.data.status === 'success'){
                    setHeader(mapRow(response.data.result[0], columns));
                    setRecords( filterCurrentUserData( 
                        response.data.result, currentUser, columns, filterColumn, filterProperty
                    ));
                }
            } catch (e) {
                console.log(e);
            }

            setLoading(false);
        };
        fetchData();
    }, [spreadSheetInfoRef, currentUser]);


    return (
        isLoading ? ( 
            <CircularProgress />
        ) : (
        <div className={classes.root}>
            <TableContainer component={Paper}>
                    <Table stickyHeader >
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

export default SpreadSheetTable;


