import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { saveObservationForm } from '../../redux/observation-form/observation-form.actions';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { INITIAL_STATE } from '../../redux/observation-form/observation-form.reducer';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
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
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { Typography } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CircularProgress from '@material-ui/core/CircularProgress';

import CustomizedSnackbar from '../../components/snack-bar/snack-bar.component';
import { selectObservationFormSubmissionMessage } from '../../redux/observation-form/observation-form.selectors';
import { resetSubmissionMessage } from '../../redux/observation-form/observation-form.actions';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
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
    addNew: {
        marginTop: theme.spacing(2),
    },
    addIcon: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.info.dark
        }
    }, 
}));

const ObservationsOverview = ({ match, history, submissionMessage, resetSubmissionMessage, currentYear, currentUser, saveObservationForm }) => {
    const classes = useStyles();
    const observationForm = { ...INITIAL_STATE };
    const [selectedTeachers, setSelectedTeachers ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //snackbar
    const handleClose = () => {
        resetSubmissionMessage();
    }

    useEffect(() => {
        const fetchSelectedTeachers = async () => {
            const ref = firestore.doc(`observationTemplates/${currentUser.id}`);
            const snapshot = await ref.get();

            if (snapshot.exists){
                const fetchedData = snapshot.data();
                if(Object.keys(fetchedData).includes('teachers')){
                    setSelectedTeachers(fetchedData.teachers)
                }
            }
        };

        fetchSelectedTeachers();
    }, [currentUser.id]);

    const handleSaveTemplates = () => {
        setIsLoading(true);
        selectedTeachers.forEach ( teacher => {
            const observation = {
                ...observationForm,
                observationDetails: {
                    observationDate: new Date(),
                    observationType: 'Weekly Observation',
                    schoolYear: currentYear,
                    observer: currentUser,
                    teacher: teacher,
                    school:teacher.school,
                    department: teacher.department,
                    block: '',
                    course: '',
                    partOfTheClass: ''
                }
            };
            saveObservationForm(observation);
        });
        setIsLoading(false);
        history.push('/observations/saved');
    }


    return (    
    <div className={classes.root}>
        {
            isLoading ?
            ( 
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            ):
            (
            <>
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
                            <ListItemText primary="Submitted Observations" />
                        </ListItem>
                    </Link>
                    <ListItem button onClick={handleSaveTemplates}>
                            <ListItemIcon>
                                <ListAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create Weekly Observations From Templates" />
                    </ListItem>
                    <Link to={`${match.path}/templates`} className={classes.links} >
                        <ListItem button>
                            <ListItemIcon>
                                <TocIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create Other Observations From Templates" />
                        </ListItem>
                    </Link>
                    <Link to={`${match.path}/templates/edit`} className={classes.links} >
                        <ListItem button>
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="Update Selected Teachers For Observation Templates" />
                        </ListItem>
                    </Link>
                    <Link to={`${match.path}/lesson-plans`} className={classes.links} >
                        <ListItem button>
                            <ListItemIcon>
                                <PlaylistAddCheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Lesson Plan Check for Selected Teachers" />
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
            </>
            )
        }  
    </div>
    );
};

const mapStateToProps = createStructuredSelector({
    submissionMessage: selectObservationFormSubmissionMessage,
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
});

const mapDispatchToProps = dispatch => ({
    resetSubmissionMessage: () => dispatch(resetSubmissionMessage()),
    saveObservationForm: observationForm => dispatch(saveObservationForm(observationForm))
})

export default connect(mapStateToProps, mapDispatchToProps)(ObservationsOverview);





