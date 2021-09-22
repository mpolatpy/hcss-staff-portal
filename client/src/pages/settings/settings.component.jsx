import { Link, withRouter } from 'react-router-dom';
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { linkWithPopup } from './merge-accounts';
import SitePreferences from './site-preference';

const SettingsPageComponent = ({ currentUser, match, setSubmissionMessage }) => {

    return (
        <div>
            <Typography variant="h4">Settings</Typography>
            {/* <Divider/> */}
            <List component="nav" aria-label="settings">
                <Link to={`${match.path}/change-password`} style={{ textDecoration: 'none', }}>
                    <ListItem button>
                        <ListItemText primaryTypographyProps={{ color: "primary" }} primary="Change Password" />
                    </ListItem>
                </Link>
                <Divider />
                {/* <ListItem button onClick={() => linkWithPopup(setSubmissionMessage)}>
                    <ListItemText primaryTypographyProps={{color:"primary"}} primary="Activate Google SignIn" />
                </ListItem>
                <Divider/> */}
                {
                    currentUser.role === 'superadmin' ?
                        (<>
                            <Link to="/register" style={{ textDecoration: 'none', }}>
                                <ListItem button>
                                    <ListItemText primaryTypographyProps={{ color: "primary" }} primary="Add User" />
                                </ListItem>
                            </Link>
                            <Divider />
                        </>
                        ) : null
                }
                {
                    ['superadmin', 'admin', 'dci'].includes(currentUser.role) ?
                        (
                            <>
                                <Link to={`${match.path}/add-link`} style={{ textDecoration: 'none', }}>
                                    <ListItem button>
                                        <ListItemText primaryTypographyProps={{ color: "primary" }} primary="Add New Link" />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link to="/observations/templates/edit" style={{ textDecoration: 'none', }}>
                                    <ListItem button>
                                        <ListItemText primaryTypographyProps={{ color: "primary" }} primary="Update Selected Teachers" />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link to={`${match.path}/update-courses`} style={{ textDecoration: 'none', }}>
                                    <ListItem button>
                                        <ListItemText primaryTypographyProps={{ color: "primary" }} primary="Update Courses" />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <ListItemText primaryTypographyProps={{ color: "primary" }} primary="Site Preferences" />
                                    <div>
                                        <SitePreferences />
                                    </div>
                                </ListItem>
                                <Divider />
                            </>
                        ) : null
                }
            </List>
        </div>
    )
};

const mapDispatchToProps = (dispatch) => ({
    setSubmissionMessage: message => setSubmissionMessage(message)
});

export default connect(null, mapDispatchToProps)(withRouter(SettingsPageComponent));