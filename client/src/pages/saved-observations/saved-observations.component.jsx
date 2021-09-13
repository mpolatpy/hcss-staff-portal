import React from 'react';
import { fetchSavedObservationsAsync, resetSavedObservations } from '../../redux/saved-observations/saved-observations.actions';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { createStructuredSelector } from 'reselect';
import { selectSavedObservationsList } from '../../redux/saved-observations/saved-observations.selectors';
import { Link } from 'react-router-dom';

import CustomModal from '../../components/modal/modal.component';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography  from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(1),
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        // boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        padding: theme.spacing(4)
    },
    links: {
        textDecoration: 'none',
        color: 'inherit'
    },
    noObservation: {
        marginTop: theme.spacing(2)
    }
});

class SavedObservations extends React.Component {

    componentDidMount() {
        const {fetchSavedObservations, currentUser, currentYear} = this.props;
        fetchSavedObservations(currentUser, currentYear);
    }

    removeSavedObservations = () => {
        const removeObservation = async (observation) => {
            await firestore.doc(`savedObservations/${observation.id}`).delete();
        };
        const { observations, resetSavedObservations } = this.props;
        observations.forEach( 
            async observation => await removeObservation(observation)
        );
        resetSavedObservations();
    }

    render(){
        const { observations, classes, match } = this.props;

        return (
                <div className={classes.root}>
                    <Typography variant="h4">Saved Observations</Typography>
                    <Divider />
                    {
                        observations.length === 0 ? (
                        <div className={classes.noObservation}>
                            <Typography>There is no saved observation.</Typography>
                        </div>
                        ): null
                    }
                    <List component="nav" aria-label="saved observation links">
                    {
                        observations.sort(
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
                        ).map((observation, index) => (
                            <Link 
                            key={index} 
                            to={`${match.url}/${observation.id}`} 
                            className={classes.links} 
                            >
                                <ListItem button>
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
                            </Link>
                        ))
                    }
                    </List>
                    {
                    observations.length ? (
                    <div>
                        <CustomModal
                            modalIcon={(
                                <Tooltip title="Remove All Saved Observations">
                                    <DeleteIcon color="action" />
                                </Tooltip>
                            )}
                            modalBody={(
                                <div>
                                    <Typography variant="h5">
                                        Please Confirm Delete
                                    </Typography>
                                    <p>All saved observations will be deleted.</p>
                                    <div>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            onClick={this.removeSavedObservations}
                                            className={classes.button}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    ) : null
                    }
                </div>

        );
    }    
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    observations: selectSavedObservationsList,
});

const mapDispatchToProps = dispatch => ({
    fetchSavedObservations: (user, year) => dispatch(fetchSavedObservationsAsync(user, year)),
    resetSavedObservations: () => dispatch(resetSavedObservations()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedObservations));