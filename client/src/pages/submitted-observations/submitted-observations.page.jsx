import React from 'react';
import { Route } from 'react-router-dom';

import withAuthorization from '../../components/with-authorization/withAuthorization.component';
import SubmittedObservationsPage from './submitted-observations.component';
import SubmittedObservationDetails from './submitted-observation.detail';
import SubmittedObservation from './single-submitted-observation';

const SubmittedObservations = (props) => {
    const {match, currentUser} = props;

    return ( 
        <div>
            <Route exact path={match.path} render={(props) => <SubmittedObservationsPage currentUser={currentUser} {...props}/>}/>
            <Route path={`${match.path}/observation/:observationId`} component={SubmittedObservation}/>
            <Route 
            path={`${match.path}/weekly/:teacherId`}
            render={() => <SubmittedObservationDetails observationType="Weekly Observation" />} />
            <Route 
            path={`${match.path}/full-class/:teacherId`}
            render={() => <SubmittedObservationDetails observationType="Full Class Observation" />} />
            <Route 
            path={`${match.path}/quarterly/:teacherId`}
            render={() => <SubmittedObservationDetails observationType="Quarter Evaluation" />} />
            <Route 
            path={`${match.path}/midyear/:teacherId`}
            render={() => <SubmittedObservationDetails observationType="Midyear Evaluation" />} />
            <Route 
            path={`${match.path}/endyear/:teacherId`}
            render={() => <SubmittedObservationDetails observationType="End of Year Evaluation" />} />
        </div>
    );
}

// export default withAuthorization(['superadmin', 'dci', 'admin'])(SubmittedObservations);
export default (SubmittedObservations);