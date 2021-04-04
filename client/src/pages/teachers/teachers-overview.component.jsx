import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectIsTeachersLoaded } from "../../redux/teachers/teachers.selectors";
import TeacherDetails from './teacher-details.component';
import WithSpinner from '../../components/with-spinner/with-spinner.component';
import EvaluationOverview from '../evaluation-overview/evaluation-overview.component';

const TeacherDetailsWithSpinner = WithSpinner(TeacherDetails);

const TeacherListOverview = (props) => {

    const { match, isLoaded } = props;

    return ( 
    <div>
        <Route exact path={`${match.path}`} component={EvaluationOverview} />
        <Route 
            path={`${match.path}/:teacherId`} 
            render={(props) => <TeacherDetailsWithSpinner 
                                isLoading={!isLoaded} 
                                {...props}/>} 
        />
    </div>
)}

const mapStateToProps = createStructuredSelector({
    isLoaded: state => selectIsTeachersLoaded(state)
});

export default connect(mapStateToProps)(TeacherListOverview);
