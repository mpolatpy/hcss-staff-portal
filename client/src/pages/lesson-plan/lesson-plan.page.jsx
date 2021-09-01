import {Link} from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import TelegramIcon from '@material-ui/icons/Telegram';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { Typography } from '@material-ui/core';

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

const LessonPlanPage = ({ match }) => {
    const classes = useStyles();

    return (    
    <div className={classes.root}>
        <Typography variant="h4">Lesson Plans</Typography>
        <Divider />
        <List component="nav" aria-label="observation links">
            <Link to={`${match.path}/check`} className={classes.links} >
                <ListItem button>
                    <ListItemIcon>
                        <PlaylistAddCheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Lesson Plan Check" />
                </ListItem>
            </Link>
            <Link to={`${match.path}/submitted`} className={classes.links} >
                <ListItem button>
                    <ListItemIcon>
                        <TelegramIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Submitted Lesson Plans - Selected Teachers" />
                </ListItem>
            </Link>
            <Link to={`${match.path}/summary`} className={classes.links} >
                <ListItem button>
                    <ListItemIcon>
                        <AssessmentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Submitted Lesson Plans - All" />
                </ListItem>
            </Link>
            <Link to="/observations/templates/edit" className={classes.links} >
                <ListItem button>
                    <ListItemIcon>
                        <EditIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Update Selected Teachers" />
                </ListItem>
            </Link>
        </List> 
    </div>
    );
};

export default LessonPlanPage;






