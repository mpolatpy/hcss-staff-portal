import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectIsTeachersLoaded } from "../../redux/teachers/teachers.selectors";
import TeacherDetails from './teacher-details.component';
import WithSpinner from '../../components/with-spinner/with-spinner.component';
import EvaluationOverview from '../evaluation-overview/evaluation-overview.component';
import TeacherObservationsComponent from '../../components/teacher-home/teacher-observations.component';
import TeacherObservationsDetailPage from './teacher-observations.component';
import TeacherLessonPlansComponent from '../../components/teacher-home/teacher-lesson-plans.component';
import TeacherGradePolicyComponent from '../../components/teacher-home/teacher-grade-policy.component';
import AttendancePage from '../attendance/attendance.page';
import TutoringPage from '../tutoring/tutoring.page';
import EditUserDetails from './edit-user-details';

const TeacherDetailsWithSpinner = WithSpinner(TeacherDetails);

const TeacherListOverview = (props) => {

    const { match, isLoaded, currentYear } = props;

    return ( 
    <div>
        <Route exact path={`${match.path}`} component={EvaluationOverview} />
        <Route exact
            path={`${match.path}/home/:teacherId`} 
            render={(props) => <TeacherDetailsWithSpinner 
                                isLoading={!isLoaded} 
                                {...props}/>} 
        />
        <Route exact path={`${match.path}/observations/:teacherId`} 
            component={TeacherObservationsComponent} 
        />
        <Route exact path={`${match.path}/lesson-plans/:teacherId`} 
            component={TeacherLessonPlansComponent} 
        />
        <Route exact path={`${match.path}/grading-feedback/:teacherId`} 
            component={TeacherGradePolicyComponent} 
        />
        <Route exact path={`${match.path}/attendance/:teacherId`} 
            component={AttendancePage} 
        />
        <Route exact path={`${match.path}/tutoring`} 
            component={TutoringPage} 
        />
        <Route exact path={`${match.path}/edit-info`} 
            component={EditUserDetails} 
        />
        <Route exact path={`${match.path}/observations/weekly/:teacherId`} 
            render={(props) => 
            <TeacherObservationsDetailPage 
                observationType="Weekly Observation"
                currentYear={currentYear}
                {...props}
                />
            } 
        />
        <Route exact path={`${match.path}/observations/full-class/:teacherId`} 
            render={(props) => 
            <TeacherObservationsDetailPage 
                observationType="Full Class Observation"
                currentYear={currentYear}
                {...props}
                />
            } 
        />
    </div>
)}

const mapStateToProps = createStructuredSelector({
    isLoaded: state => selectIsTeachersLoaded(state),
    currentYear: selectCurrentYear,
});

export default connect(mapStateToProps)(TeacherListOverview);
