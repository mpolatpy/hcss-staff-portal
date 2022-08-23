import './App.css';
import { lazy, useEffect, Suspense, useMemo } from 'react';
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { auth, createUserProfileDocument, fetchCurrentYear } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from "./redux/user/user.selectors";
import { selectCurrentYear } from './redux/school-year/school-year.selectors';
import { setCurrentYear } from './redux/school-year/school-year.actions';

import MiniDrawer from './components/drawer/drawer.component';
import ScrollToTop from './components/scroll-to-top/scroll-to-top.component';
import SignInForm from './pages/sign-in/sign-in.component';
import Spinner from './components/with-spinner/spinner-component';
import ErrorBoundary from './components/error-boundary/error-boundary.component';
import { Button } from '@material-ui/core';

const HomePage = lazy(() => import('./pages/home/home.component'));
const NotFound = lazy(() => import('./pages/404/not-found.component'));
const ProfilePage = lazy(() => import('./pages/profile/profile.component'));
const Observations = lazy(() => import('./pages/observations/observations.component'));
const UserRegistrationPage = lazy(() => import('./pages/register/register.component'));
const TeacherListOverview = lazy(() => import('./pages/teachers/teachers-overview.component'));
const Directory = lazy(() => import('./pages/teachers/teacher-list.component'));
const SettingsPage = lazy(() => import('./pages/settings/settings-page'));
const LessonPlans = lazy(() => import('./pages/lesson-plan/lesson-plan.routes'));
const ImportantLinks = lazy(() => import('./pages/important-links/important-links.component'));
const ParentCommunicationRoute = lazy(() => import('./pages/parent-communication/parent-communications.routes'));
const NotificationsPage = lazy(() => import('./pages/notifications/notifications.page'));
const Calendar = lazy(() => import('./pages/calendar/calendar.routes.page'));
const StudentAchievement = lazy(() => import('./pages/student-achievement/student-achievement.routes'));
const GradebookCheck = lazy(() => import('./pages/grade-policy/grade-policy.routes'));
const AdminReports = lazy(() => import('./pages/admin-reports/admin-reports'));
const TestResultsPage = lazy(() => import('./pages/test-results/test-results.page'));

const RoleErrorPage = () => (
  <div style={{ margin: '20px' }}>
    <h3>Please contact IT department to fix the issue with the account.</h3>
    <Button onClick={() => auth.signOut()} variant="contained" color="primary">Back to Login Page</Button>
  </div>
);

function App(props) {

  const { currentUser, currentYear, setCurrentYear } = props;
  let history = useHistory();

  useEffect(() => {

    const { setCurrentUser } = props;

    const unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
        });
      }

      setCurrentUser(userAuth);
    });

    fetchCurrentYear(setCurrentYear);

    return () => {
      unsubscribeFromAuth();
    }
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setCurrentYear(value);
    history.push('/home');
  };

  return (
    <div>
      <Route exact path="/"
        render={() => (
          currentUser ?
            <Redirect to="/home" /> :
            <SignInForm />
        )}
      />

      {
        !currentUser ?
          <Redirect to='/' /> : (
            !currentUser?.role ? (
              <RoleErrorPage />
            ) : (
              <MiniDrawer handleChange={handleChange} year={currentYear}>
                <ScrollToTop />
                <ErrorBoundary>
                  <Suspense fallback={<Spinner />}>
                    <Switch>
                      <Route exact path="/directory" component={Directory} />
                      <Route exact path="/register" component={UserRegistrationPage} />
                      <Route path="/staff" component={TeacherListOverview} />
                      <Route path="/admin-reports" component={AdminReports} />
                      <Route path="/home" render={() => <HomePage currentUser={currentUser} />} />
                      <Route path="/observations" component={Observations} />
                      <Route path="/notifications" component={NotificationsPage} />
                      <Route path="/lesson-plans" component={LessonPlans} />
                      <Route path="/important-links" component={ImportantLinks} />
                      <Route path="/parent-communication" component={ParentCommunicationRoute} />
                      <Route path="/calendar" component={Calendar} />
                      <Route path="/student-achievement" component={StudentAchievement} />
                      <Route path="/test-results" component={TestResultsPage} />
                      <Route path="/grade-policy" component={GradebookCheck} />
                      <Route path="/profile"
                        render={() => (<ProfilePage currentUser={currentUser} />)}
                      />
                      <Route path="/settings"
                        render={() => (<SettingsPage currentUser={currentUser} />)}
                      />
                      <Route component={NotFound} />
                    </Switch>
                  </Suspense>
                </ErrorBoundary>
              </MiniDrawer>
            ))
      }
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  currentYear: selectCurrentYear,
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)),
  setCurrentYear: year => dispatch(setCurrentYear(year)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
