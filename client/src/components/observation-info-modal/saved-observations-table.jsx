import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { selectSavedObservationsList } from '../../redux/saved-observations/saved-observations.selectors';

const SavedObservationsTable = ({observations, teacher, mySavedObservations}) => {

    const myObservations = mySavedObservations.filter ( 
        observation => observation.observationDetails.block !== ''
    ).sort(
        (o1, o2) => {
            const t1 = o1.observationDetails.observationDate ? 
                        o1.observationDetails.observationDate.seconds : 
                        o1.observationDetails.submittedAt.seconds;
            const t2 = o2.observationDetails.observationDate ? 
                        o2.observationDetails.observationDate.seconds : 
                        o2.observationDetails.submittedAt.seconds;

            const date1 = new Date(t1 * 1000);
            date1.setHours(0,0,0,0);
            const date2 = new Date(t2 * 1000);
            date2.setHours(0,0,0,0);

            if(date1.getTime() !== date2.getTime()){
                return date1.getTime() - date2.getTime();
            }

            const block1 = o1.observationDetails.block;
            const block2 = o2.observationDetails.block;

            if(block1 === ''){
                return 1
            } else if(block2 === ''){
                return -1
            } else{
                return block1 - block2;
            }
        }
    );

    return ( 
    <>
    <div style={{ marginTop: '20px'}}>
        <Typography variant="h6">{`Scheduled Observations for ${teacher.firstName} ${teacher.lastName}`}</Typography>
        {
            observations.length ? (
        
        <TableContainer style={{ width: '35vw' }}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Block</TableCell>
                <TableCell>Observer</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {
                observations && observations.map(observation => (
                <TableRow key={observation.firestoreRef.id}>
                    <TableCell>{new Date(observation.observationDetails.observationDate.seconds * 1000).toLocaleDateString("en-US")}</TableCell>
                    <TableCell>{observation.observationDetails.block}</TableCell>
                    <TableCell>{`${observation.observationDetails.observer.lastName}, ${observation.observationDetails.observer.firstName}`}</TableCell>
                </TableRow>
                ))
            }
            </TableBody>
        </Table>
        </TableContainer>
            ): (
                <Typography>{`There is no saved observations for ${teacher.firstName} ${teacher.lastName}`}</Typography>
            )
        }
    </div>
    <div style={{ marginTop: '20px'}}>
        <Typography variant="h6">My Scheduled Observations</Typography>
        <List>
        {
            myObservations.map(observation => (
                <ListItem >
                    <ListItemIcon>
                        <SaveIcon />
                    </ListItemIcon>
                    <div>
                        <ListItemText
                            primary={
                                `${observation.observationDetails.observationType} - 
                                    ${observation.observationDetails.teacher.firstName} 
                                ${observation.observationDetails.teacher.lastName}`
                            }
                        />
                        <ListItemText
                            primary={
                                observation.observationDetails.observationDate?
                                `Date: ${new Date(observation.observationDetails.observationDate.seconds * 1000).toLocaleDateString("en-US")}`:
                                `Date: ${new Date(observation.submittedAt.seconds * 1000).toLocaleDateString("en-US")}`
                            }
                        />
                        {
                            observation.observationDetails.block !== '' && ( 
                                <ListItemText
                                    primary={
                                        `Block: ${observation.observationDetails.block}`
                                    }
                                />
                            )
                        }
                        
                    </div>
                </ListItem>
            ))
        }
        </List>
    </div>
    </>
    )
};

const mapStateToProps = createStructuredSelector({
    mySavedObservations: selectSavedObservationsList
});

export default connect(mapStateToProps)(SavedObservationsTable);