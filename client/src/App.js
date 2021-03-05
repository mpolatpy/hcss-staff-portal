import './App.css';
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

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

function App(props) {

  const { currentUser } = props;

  useEffect( () => {

    const { setCurrentUser, setCurrentYear } = props;

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
  }, [] );


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
          <MiniDrawer >
            <Switch>
              <Route exact path="/directory" component={Directory}/>
              <Route exact path="/register" component={UserRegistrationPage}/>
              <Route path="/staff" component={TeacherListOverview} />
              <Route path="/home" component={HomePage}  /> 
              <Route path="/observations" component={Observations} />
              <Route path="/profile" 
                render={() => ( 
                  <ProfilePage currentUser={currentUser} />
                )}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
