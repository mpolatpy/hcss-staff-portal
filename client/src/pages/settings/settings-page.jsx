import { Route, withRouter } from 'react-router-dom';
import SettingsPageComponent from './settings.component';
import ChangePasswordComponent from '../../components/change-password/change-password.component';

const SettingsPage = ({currentUser, match}) => {
    return ( 
        <>
            <Route exact path={match.path} 
            render={() => <SettingsPageComponent currentUser={currentUser}/>}
            />
            <Route path={`${match.path}/change-password`} component={ChangePasswordComponent}/>
        </>
    )
};

export default withRouter(SettingsPage);
