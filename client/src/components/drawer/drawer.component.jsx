import { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import CustomizedSnackbar from '../snack-bar/snack-bar.component';
import CustomModal from '../modal/modal.component';
import { selectObservationFormSubmissionMessage } from '../../redux/observation-form/observation-form.selectors';
import { resetSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { setCurrentYear } from '../../redux/school-year/school-year.actions';
import NotificationModal from './notification-modal.component';
import DrawerSelect from './select.component';

import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import NotificationsSharpIcon from '@material-ui/icons/NotificationsSharp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Container from '@material-ui/core/Container';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LinkIcon from '@material-ui/icons/Link';
import SettingsIcon from '@material-ui/icons/Settings';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import useStyles from "./drawer.styles";

const MiniDrawer = ({children, currentUser, currentYear, submissionMessage, resetSubmissionMessage, handleChange, year}) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [years, setYears] = useState([]);

    useEffect( () =>{
        const fetchNotifications = async () => {
            const notificationsRef = firestore.collection(`notifications/${currentYear}/${currentUser.id}`);
            const query = notificationsRef.where('display', '==', true);
            const snapshot = await query.get();
            if(snapshot.empty){
                return;
            }

            let fetchedNotifications = [];
            snapshot.forEach(doc => {
                fetchedNotifications = [...fetchedNotifications, {...doc.data(), ref: doc.id}]
            });
            setNotifications(fetchedNotifications);
        };

        const fetchYears = async () => {
            const ref = firestore.collection('years');
            const snapshot = await ref.get();
            let years = [];

            if(!snapshot.empty) {
                snapshot.docs.forEach( doc => years = [...years, doc.data().schoolYear])
            }
            setYears(years);
        }

        fetchNotifications();
        fetchYears();

        return () => setYears([]);
    },[currentUser.id, currentYear]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    //snackbar
    const handleClose = () => {
        resetSubmissionMessage();
    }


    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.upperMenu}>
                        <Typography variant="h6" noWrap>
                            HCSS STAFF PORTAL
                        </Typography>
                        <div className={classes.upperMenuIcons}> 
                            <DrawerSelect years={years} handleChange={handleChange} year={year}/>
                            <CustomModal
                            color="inherit"
                            modalIcon={( 
                                <Badge badgeContent={notifications.length} color="secondary">
                                    <NotificationsSharpIcon />
                                </Badge>
                            )}
                            modalBody={
                                <NotificationModal 
                                notifications={notifications}
                                currentUser={currentUser}
                                currentYear={currentYear}
                                setNotifications={setNotifications}
                                />}
                            />
                            <Link to="/profile" className={classes.links}>
                                <IconButton color="inherit"><AccountCircleIcon /></IconButton>
                            </Link>
                            <IconButton color="inherit" onClick={() => auth.signOut()}>
                                <ExitToAppIcon />
                            </IconButton>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    {/* <Typography variant="h6" noWrap>
                        HCSS Rocks
                    </Typography> */}
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List> 
                    <Link to="/home" className={classes.links}>
                        <ListItem button key={"home"}>
                            <ListItemIcon><HomeIcon className={classes.menuIcon} /></ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItem>
                    </Link>
                    <Link to="/observations" className={classes.links}>
                        <ListItem button key={"observations"}>
                            <ListItemIcon><EventNoteIcon className={classes.menuIcon}/></ListItemIcon>
                            <ListItemText primary={"Observation"} />
                        </ListItem>
                    </Link>
                    <Link to="/lesson-plans" className={classes.links}>
                        <ListItem button key={"observations"}>
                            <ListItemIcon><DoneAllIcon className={classes.menuIcon}/></ListItemIcon>
                            <ListItemText primary={"Lesson Plans"} />
                        </ListItem>
                    </Link>
                    <Divider />
                    {
                        currentUser.role !== 'teacher' ? (
                        <>
                        <Link to="/directory" className={classes.links}>
                            <ListItem button key={"users"}>
                                <ListItemIcon><GroupOutlinedIcon className={classes.menuIcon} /></ListItemIcon>
                                <ListItemText primary={"Users"} />
                            </ListItem>
                        </Link>
                        <Link to="/staff" className={classes.links}>
                            <ListItem button key={"teachers"}>
                                <ListItemIcon><EqualizerOutlinedIcon className={classes.menuIcon}/></ListItemIcon>
                                <ListItemText primary={"Evaluation"} />
                            </ListItem>
                        </Link>
                        </>
                        ): null
                    
                    }

                    <Link to="#" className={classes.links}>
                        <ListItem button key={"links"}>
                            <ListItemIcon><LinkIcon className={classes.menuIcon} /></ListItemIcon>
                            <ListItemText primary={"Important Links"} />
                        </ListItem>
                    </Link>
                    <Link to="/settings" className={classes.links}>
                        <ListItem button key={"settings"}>
                            <ListItemIcon><SettingsIcon className={classes.menuIcon} /></ListItemIcon>
                            <ListItemText primary={"Settings"} />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Container maxWidth="xl">
                    {children}
                </Container>
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
            </main>    
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    submissionMessage: selectObservationFormSubmissionMessage,
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear
});

const mapDispatchToProps = dispatch => ({
    resetSubmissionMessage: () => dispatch(resetSubmissionMessage()),
    setCurrentYear: (year) => dispatch(setCurrentYear(year))
})

export default connect(mapStateToProps, mapDispatchToProps)(MiniDrawer);
