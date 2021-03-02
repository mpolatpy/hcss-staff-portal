import React from 'react';
import { fetchSavedObservationsAsync, resetSavedObservations } from '../../redux/saved-observations/saved-observations.actions';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';
import { selectSavedObservationsList, selectSavedObservationsIsloading } from '../../redux/saved-observations/saved-observations.selectors';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(5),
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        padding: theme.spacing(4)
    },
    links: {
        textDecoration: 'none',
        color: 'inherit'
    }
});

class SavedObservations extends React.Component {

    componentDidMount() {
        const {fetchSavedObservations} = this.props;
        fetchSavedObservations(this.props.currentUser);
    }

    render(){
        const { observations, classes, match } = this.props;
        return (
                <div className={classes.root}>
                    <Typography variant="h4">Saved Observations</Typography>
                    <Divider />
                    <List component="nav" aria-label="saved observation links">
                    {
                        observations.map((observation, index) => (
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
                                                `Teacher: ${observation.observationDetails.teacher.firstName} 
                                                ${observation.observationDetails.teacher.lastName}`
                                            }
                                        />
                                        <ListItemText
                                            primary={
                                                observation.observationDetails.observationDate?
                                                `Date: ${new Date(observation.observationDetails.observationDate.seconds * 1000).toDateString()}`:
                                                `Date: ${new Date(observation.submittedAt.seconds * 1000).toDateString()}`
                                            }
                                        />
                                        <ListItemText
                                            primary={
                                                `Observation Type: ${observation.observationDetails.observationType}`
                                            }
                                        />
                                    </div>
                                </ListItem>
                                <Divider />
                            </Link>
                        ))
                    }
                    </List>
                </div>

        );
    }    
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    observations: selectSavedObservationsList,
});

const mapDispatchToProps = dispatch => ({
    fetchSavedObservations: (user) => dispatch(fetchSavedObservationsAsync(user)),
    resetSavedObservations: () => dispatch(resetSavedObservations())
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedObservations));