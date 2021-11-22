import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import MentorMeetings from './mentor-mentee.meetings';
import AdminReportsPage from './admin-reports-page';
import withAuthorization from '../../components/with-authorization/withAuthorization.component';

const AdminReports = ({ match, currentUser, currentYear }) => {

    return (
        <>
            <Route exact
                path={match.path}
                render={() => <AdminReportsPage match={match} currentUser={currentUser} />} 
            />
            <Route exact
                path={`${match.path}/mentor-meetings`}
                render={() => (
                    <MentorMeetings match={match} currentUser={currentUser} currentYear={currentYear} />
                )}
            />
            {/* <Route exact path={`${match.path}/observations`}  component={ObservationReportsPage}/>
        <Route exact path={`${match.path}/lesson-plans`}  component={LessonPlanReportsPage}/> */}
        </>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear
});

export default (withRouter((connect(mapStateToProps)(AdminReports))));
