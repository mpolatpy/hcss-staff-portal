import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';


const AdminReports = ({match, currentUser}) => {

    return ( 
    <>
        {/* <Route exact path={match.path} component={AdminReportsPage} />
        <Route exact path={`${match.path}/observations`}  component={ObservationReportsPage}/>
        <Route exact path={`${match.path}/lesson-plans`}  component={LessonPlanReportsPage}/> */}
    </>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default withRouter(connect(mapStateToProps)(AdminReports));
