import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import GradePolicyPage from './grade-policy.page';
import GradePolicyCheckPage from './grade-policy-check.page';
import SubmittedGradePolicyChecks from './submitted-grade-policy-checks';
import GradePolicyEditPage from './grade-policy-edit';

const GradebookCheck = (props) => {
    const {match, currentUser} = props;

    return ( 
    <>
        <Route exact path={match.path}>
            {
                currentUser.role === 'teacher' ? ( 
                    <Redirect to={`/staff/grading-feedback/${currentUser.id}`}/>
                ) : ( 
                    <GradePolicyPage {...props} />
                )
            }
        </Route>
        <Route exact path={`${match.path}/check`} component={GradePolicyCheckPage} />
        <Route exact path={`${match.path}/submitted`}  component={SubmittedGradePolicyChecks}/>
        <Route exact path={`${match.path}/submitted/:gradeCheckId`}  component={GradePolicyEditPage}/>
    </>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default withRouter(connect(mapStateToProps)(GradebookCheck));