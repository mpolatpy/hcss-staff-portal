import React from 'react';
import { auth } from '../../firebase/firebase.utils';

import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import useStyles from "./drawer.styles";

export default function MiniDrawer({children}) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

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
                            <IconButton color="inherit"><NotificationsSharpIcon /></IconButton>
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
                    <Link to="/directory" className={classes.links}>
                    <ListItem button key={"users"}>
                        <ListItemIcon><GroupOutlinedIcon className={classes.menuIcon} /></ListItemIcon>
                        <ListItemText primary={"Users"} />
                    </ListItem>
                    </Link>
                    <Link to="/observations" className={classes.links}>
                        <ListItem button key={"test"}>
                            <ListItemIcon><EventNoteIcon className={classes.menuIcon}/></ListItemIcon>
                            <ListItemText primary={"Observation"} />
                        </ListItem>
                    </Link>
                    <Link to="/staff" className={classes.links}>
                        <ListItem button key={"teachers"}>
                            <ListItemIcon><EqualizerOutlinedIcon className={classes.menuIcon}/></ListItemIcon>
                            <ListItemText primary={"Evaluation"} />
                        </ListItem>
                    </Link>
                    <Link to="#" className={classes.links}>
                        <ListItem button key={"teachers"}>
                            <ListItemIcon><LinkIcon className={classes.menuIcon} /></ListItemIcon>
                            <ListItemText primary={"Important Links"} />
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
            </main>
        </div>
    );
}
