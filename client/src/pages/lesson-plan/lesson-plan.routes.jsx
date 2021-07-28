import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import LessonPlanPage from './lesson-plan.page';
import LessonPlanCheckPage from './lesson-plan-check.component';
import SubmittedLessonPlans from './submitted-lesson-plans';

const LessonPlans = (props) => {
    const {match, currentUser} = props;

    return ( 
    <>
        {/* <Route exact path={match.path}  component={LessonPlanPage}/> */}
        <Route exact path={match.path}>
            {
                currentUser.role === 'teacher' ? ( 
                    <Redirect to={`/staff/lesson-plans/${currentUser.id}`}/>
                ) : ( 
                    <LessonPlanPage {...props} />
                )
            }
            </Route>
        <Route exact path={`${match.path}/check`}  component={LessonPlanCheckPage}/>
        <Route exact path={`${match.path}/submitted`}  component={SubmittedLessonPlans}/>
    </>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default withRouter(connect(mapStateToProps)(LessonPlans));