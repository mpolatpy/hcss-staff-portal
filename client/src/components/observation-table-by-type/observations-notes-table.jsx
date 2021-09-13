import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        },
        minHeight: 450,
        marginBottom: '10px'
    },
    notes: {
        width: '65vw',
        padding: '6px 8px',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: 'inherit'
    }
}));

const ObservationNotesTable = ({observations}) => {
    const classes = useStyles();

    return ( 
    <div className={classes.root}>
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Observer</TableCell>
                <TableCell>Notes</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {
                observations.map( (observation, i) => ( 
                    <TableRow key={`observation_note_${i}`}>
                        <TableCell>
                            <Link to={`/observations/submitted/observation/${observation.firestoreRef.id}`} >
                                {
                                ( observation.observationDetails.observationDate ?
                                new Date(observation.observationDetails.observationDate.seconds * 1000).toLocaleDateString("en-US") :
                                new Date(observation.submittedAt.seconds * 1000).toLocaleDateString("en-US")
                                )
                                }
                            </Link>
                        </TableCell>
                        <TableCell>{observation.observationDetails.course}</TableCell>
                        <TableCell>{`${observation.observationDetails.observer.firstName} ${observation.observationDetails.observer.lastName}`}</TableCell>
                        <TableCell className={classes.notes}>
                        { 
                            observation.observationNotes && 
                            (
                            <TextareaAutosize 
                                value={observation.observationNotes}
                                className={classes.notes} 
                                aria-label="observation notes" 
                                readOnly={true}
                                placeholder="" 
                            />
                            )
                        }
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    </Table>
    </div>
    )
};

export default ObservationNotesTable;