import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { fetchTeachersAsync } from './redux/teachers/teachers.actions';
import { auth, createUserProfileDocument, fetchCurrentYear } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from "./redux/user/user.selectors";
import { selectCurrentYear } from './redux/school-year/school-year.selectors';
import { setCurrentYear } from './redux/school-year/school-year.actions';
import NotFound from './pages/404/not-found.component';
import ProfilePage from './pages/profile/profile.component';
import HomePage from './pages/home/home.component';
import SignInForm from './pages/sign-in/sign-in.component';
import MiniDrawer from './components/drawer/drawer.component';
import Observations from './pages/observations/observations.component';
import UserRegistrationPage from './pages/register/register.component';
import TeacherListOverview from './pages/teachers/teachers-overview.component';
import Directory from './pages/teachers/teacher-list.component';
import SettingsPage from './pages/settings/settings-page';
import LessonPlans from './pages/lesson-plan/lesson-plan.routes';
import ScrollToTop from './components/scroll-to-top/scroll-to-top.component';
import ImportantLinks from './pages/important-links/important-links.component';
import ParentCommunicationPage from './pages/parent-communication/parent-communication.page';

function App(props) {

  const { currentUser, currentYear, setCurrentYear } = props;
  let history = useHistory();

  useEffect( () => {

    const { setCurrentUser, fetchTeachersAsync } = props;

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
    fetchTeachersAsync();
 
    return () => {
      unsubscribeFromAuth();
    }
  }, [] );


  const [year,setYear] = useState('');

  const handleChange = (e) => {
      const { value } = e.target;
      setCurrentYear(value);
      setYear(value);
      history.push('/home');
  };

  return (
    <div>
          <Route exact path="/" 
            render={ () => ( 
              currentUser ?
              <Redirect to="/home"/>:
              <SignInForm />
            )}  
          />

          {!currentUser ?
          <Redirect to='/' /> :
          <MiniDrawer handleChange={handleChange} year={currentYear}>
            <ScrollToTop />
            <Switch>
              <Route exact path="/directory" component={Directory}/>
              <Route exact path="/register" component={UserRegistrationPage}/>
              <Route path="/staff" component={TeacherListOverview} />
              <Route path="/home" component={HomePage}  /> 
              <Route path="/observations" component={Observations} />
              <Route path="/lesson-plans" component={LessonPlans} />
              <Route path="/important-links" component={ImportantLinks} />
              <Route path="/parent-communication" component={ParentCommunicationPage} />
              <Route path="/profile" 
                render={() => ( <ProfilePage currentUser={currentUser} /> )}
              />
              <Route path="/settings" 
                render={() => ( <SettingsPage currentUser={currentUser} />)} 
              />
              <Route component={NotFound}/>
            </Switch>
          </MiniDrawer>
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
  fetchTeachersAsync: () => dispatch(fetchTeachersAsync())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
