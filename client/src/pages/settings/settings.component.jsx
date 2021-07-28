import { Link, withRouter } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { List, ListItem, ListItemText } from '@material-ui/core';

const SettingsPageComponent = ({currentUser, match}) => {

    return (
        <div>
            <Typography variant="h4">Settings</Typography>
            <Divider/>
            <List component="nav" aria-label="settings">
                <Link to={`${match.path}/change-password`} style={{textDecoration: 'none',}}>
                    <ListItem button>
                        <ListItemText primaryTypographyProps={{color:"primary"}} primary="Change Password" />
                    </ListItem>
                </Link>
                <ListItem button>
                    <ListItemText primaryTypographyProps={{color:"primary"}} primary="Other Items" />
                </ListItem>
                {
                    currentUser.role === 'superadmin' ?
                    (<Link to="/register" style={{textDecoration: 'none',}}>
                        <ListItem button>
                            <ListItemText primaryTypographyProps={{color:"primary"}} primary="Add User" />
                        </ListItem>
                    </Link>): null
                }
                {
                    ['superadmin', 'admin', 'dci'].includes(currentUser.role) ?
                    (<Link to="/observations/templates/edit" style={{textDecoration: 'none',}}>
                        <ListItem button>
                            <ListItemText primaryTypographyProps={{color:"primary"}} primary="Update Selected Teachers" />
                        </ListItem>
                    </Link>): null
                }
            </List>
        </div>
    )
};

export default withRouter(SettingsPageComponent);