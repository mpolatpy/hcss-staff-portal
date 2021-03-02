import React, {useEffect} from 'react';
import { Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { fetchTeachersAsync } from '../../redux/teachers/teachers.actions';
import { selectIsTeachersLoaded } from '../../redux/teachers/teachers.selectors';
import { selectCurrentUser } from "../../redux/user/user.selectors";

import ObservationsOverview from './observations-overview.component';
import NewObservationPage from '../new-observation/new-observation.component';
import SavedObservations from '../saved-observations/saved-observations.component';
import SavedObservationDetail from '../saved-observations/saved-observation-detail.component';
import SubmittedObservations from './submitted-observations.component';
import WithAuthorization from '../../components/with-authorization/withAuthorization.component';


const Observations = (props) => {
    const { match, currentUser, isTeachersLoaded, fetchTeachersAsync, ...otherProps } = props;

    useEffect(() => {
        if(!isTeachersLoaded){
            fetchTeachersAsync();
        }
    },[]);

    return ( 
        <div>
            <Route exact path={match.path} component={ObservationsOverview}/>
            <Route path={`${match.path}/submitted`} component={SubmittedObservations} />
            <Route exact path={`${match.path}/new`} component={NewObservationPage}/>
            <Route exact path={`${match.path}/saved`} component={SavedObservations} />
            <Route exact 
            path={`${match.path}/saved/:observationId`} 
            isLoading={!isTeachersLoaded}
            fetchTeachersAsync={fetchTeachersAsync}
            component={SavedObservationDetail} />
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    isTeachersLoaded: selectIsTeachersLoaded
});

const mapDispatchToProps = dispatch => ({
    fetchTeachersAsync: () => dispatch(fetchTeachersAsync())
})

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthorization(['superadmin', 'dci', 'admin'])(Observations));