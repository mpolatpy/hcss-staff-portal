import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import TelegramIcon from '@material-ui/icons/Telegram';
import TocIcon from '@material-ui/icons/Toc';
import { Typography } from '@material-ui/core';

import CustomizedSnackbar from '../../components/snack-bar/snack-bar.component';
import { selectObservationFormSubmissionMessage } from '../../redux/observation-form/observation-form.selectors';
import { resetSubmissionMessage } from '../../redux/observation-form/observation-form.actions';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        padding: theme.spacing(4)
    },
    links: {
        textDecoration: 'none',
        color: 'inherit'
    },
    addNew: {
        marginTop: theme.spacing(2),
    },
    addIcon: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.info.dark
        }
    }
}));

const ObservationsOverview = ({ match, submissionMessage, resetSubmissionMessage }) => {
    const classes = useStyles();

    //snackbar
    const handleClose = () => {
        resetSubmissionMessage();
    }

    return (    
    <div className={classes.root}>
            <Typography variant="h4">Observations</Typography>
            <Divider />
            <List component="nav" aria-label="observation links">
                <Link to={`${match.path}/saved`} className={classes.links} >
                    <ListItem button>
                            <ListItemIcon>
                                <SaveIcon />
                            </ListItemIcon>
                            <ListItemText primary="Saved Observations" />
                    </ListItem>
                </Link>
                <Link to={`${match.path}/submitted`} className={classes.links} >
                    <ListItem button>
                        <ListItemIcon>
                            <TelegramIcon />
                        </ListItemIcon>
                        <ListItemText primary="Submitted observations" />
                    </ListItem>
                </Link>
                <Link to={`${match.path}/templates`} className={classes.links} >
                    <ListItem button>
                        <ListItemIcon>
                            <TocIcon />
                        </ListItemIcon>
                        <ListItemText primary="Observation Templates" />
                    </ListItem>
                </Link>
            </List>
            <div className={classes.addNew}>
                <Link to={`${match.path}/new`} >
                    <Tooltip title="New Observation" aria-label="add">
                        <Fab color="primary" aria-label="add">
                            <AddIcon  />
                        </Fab>
                    </Tooltip>
                </Link>
            </div>
            {
                submissionMessage.status ?
                    (<CustomizedSnackbar
                        open={true}
                        handleClose={handleClose}
                        severity={submissionMessage.status}
                        message={submissionMessage.message}
                    />)
                    : null

            }
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    submissionMessage: selectObservationFormSubmissionMessage
});

const mapDispatchToProps = dispatch => ({
    resetSubmissionMessage: () => dispatch(resetSubmissionMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ObservationsOverview);





