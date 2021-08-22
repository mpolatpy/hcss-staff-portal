import { Link, withRouter } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { List, ListItem, ListItemText } from '@material-ui/core';

const SettingsPageComponent = ({currentUser, match}) => {

    return (
        <div>
            <Typography variant="h4">Settings</Typography>
            {/* <Divider/> */}
            <List component="nav" aria-label="settings">
                <Link to={`${match.path}/change-password`} style={{textDecoration: 'none',}}>
                    <ListItem button>
                        <ListItemText primaryTypographyProps={{color:"primary"}} primary="Change Password" />
                    </ListItem>
                </Link>
                <Divider/>
                {
                    currentUser.role === 'superadmin' ?
                    ( <>
                    <Link to="/register" style={{textDecoration: 'none',}}>
                        <ListItem button>
                            <ListItemText primaryTypographyProps={{color:"primary"}} primary="Add User" />
                        </ListItem>
                    </Link>
                    <Divider/>
                    <Link to={`${match.path}/update-courses`} style={{textDecoration: 'none',}}>
                        <ListItem button>
                            <ListItemText primaryTypographyProps={{color:"primary"}} primary="Update Courses" />
                        </ListItem>
                    </Link>
                    <Divider/>
                    </>
                    ): null
                }
                {
                    ['superadmin', 'admin', 'dci'].includes(currentUser.role) ?
                    (
                    <>
                    <Link to={`${match.path}/add-link`} style={{textDecoration: 'none',}}>
                        <ListItem button>
                            <ListItemText primaryTypographyProps={{color:"primary"}} primary="Add New Link" />
                        </ListItem>
                    </Link>
                    <Divider/>
                    <Link to="/observations/templates/edit" style={{textDecoration: 'none',}}>
                        <ListItem button>
                            <ListItemText primaryTypographyProps={{color:"primary"}} primary="Update Selected Teachers" />
                        </ListItem>
                    </Link>
                    <Divider/>
                    </>
                    ): null
                }
            </List>
        </div>
    )
};

export default withRouter(SettingsPageComponent);