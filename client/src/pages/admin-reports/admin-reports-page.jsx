import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        // boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        // padding: theme.spacing(4)
    },
    links: {
        textDecoration: 'none',
        // color: 'inherit'
    },
}));

const AdminReportsPage = ({ match, currentUser }) => {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="h5">Admin Reports</Typography>
            <hr />
            <List component="nav" aria-label="admin report links">
                <Link to={`/observations/submitted`} className={classes.links} >
                    <ListItem button>
                        <ListItemText primary="Submitted Observations" />
                    </ListItem>
                </Link>
                <Link to={`/lesson-plans/summary`} className={classes.links} >
                    <ListItem button>
                        <ListItemText primary="Lesson Plans" />
                    </ListItem>
                </Link>
                <Link to={`${match.path}/mentor-meetings`} className={classes.links} >
                    <ListItem button>
                        <ListItemText primary="Mentor Meetings" />
                    </ListItem>
                </Link>
                <a
                    href="https://docs.google.com/spreadsheets/d/1dx7D7DNX0gTf5iPqYEY4U0oE7iwvD0tN7B8AZiTijfY/edit#gid=774145102"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none'}}
                >
                    <ListItem button>
                        <ListItemText primary="Quarter Final Results" />
                    </ListItem>
                </a>
                <a
                    href="https://docs.google.com/spreadsheets/d/11EH0mypLAx5QUwP8D5OVSDrabxpc5SI_E64Uk2KT1hg/edit#gid=1871336348"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none'}}
                >
                    <ListItem button>
                        <ListItemText primary="AP Results" />
                    </ListItem>
                </a>
            </List>
        </div>
    );
};

export default AdminReportsPage;