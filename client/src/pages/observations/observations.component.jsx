import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import ObservationsOverview from './observations-overview.component';
import NewObservationPage from '../new-observation/new-observation.component';
import SavedObservations from '../saved-observations/saved-observations.component';
import SavedObservationDetail from '../saved-observations/saved-observation-detail.component';
import SubmittedObservations from '../submitted-observations/submitted-observations.page';
import ObservationTemplatesPage from './observation-template.component';
import ObservationTemplateEditPage from './observation-template-edit.component';

const Observations = (props) => {
    const {match, currentUser} = props;

    return ( 
        <div>
            <Route exact path={match.path}>
            {
                currentUser.role === 'teacher' ? ( 
                    <Redirect to={`/staff/observations/${currentUser.id}`}/>
                ) : ( 
                    <ObservationsOverview {...props} />
                )
            }
            </Route>
            <Route path={`${match.path}/submitted`} render={(props) => <SubmittedObservations currentUser={currentUser} {...props} />} />
            <Route exact path={`${match.path}/templates`} component={ObservationTemplatesPage} />
            <Route path={`${match.path}/templates/edit`} component={ObservationTemplateEditPage} />
            <Route exact path={`${match.path}/new`} component={NewObservationPage}/>
            <Route exact path={`${match.path}/saved`} component={SavedObservations} />
            <Route exact 
            path={`${match.path}/saved/:observationId`}
            component={SavedObservationDetail} />
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});


export default connect(mapStateToProps)(Observations);