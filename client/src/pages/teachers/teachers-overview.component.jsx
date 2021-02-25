import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectTeacherList, selectTeachersIsLoading, selectIsTeachersLoaded } from "../../redux/teachers/teachers.selectors";
import TeacherTableContainer from './teacher-list.component';
import TeacherDetails from './teacher-details.component';
import WithSpinner from '../../components/with-spinner/with-spinner.component';
import { fetchTeachersAsync } from '../../redux/teachers/teachers.actions';

const TeacherTableWithSpinner = WithSpinner(TeacherTableContainer);
const TeacherDetailsWithSpinner = WithSpinner(TeacherDetails);

const TeacherListOverview = (props) => {

    const { match, fetchTeachersAsync, isLoading, isLoaded, teacherList } = props;

    useEffect(() => {
        fetchTeachersAsync();
    }, [fetchTeachersAsync])

    return ( 
    <div>
        <Route 
            exact 
            path={`${match.path}`} 
            render={(props) =>  <TeacherTableWithSpinner 
                                    isLoading={isLoading} 
                                    teacherList={teacherList}
                                    {...props}
                                />
                    }
        />
        <Route 
            path={`${match.path}/:teacherId`} 
            render={(props) => <TeacherDetailsWithSpinner 
                                isLoading={!isLoaded} 
                                {...props}/>} 
        />
    </div>
)}

const mapStateToProps = createStructuredSelector({
    teacherList: selectTeacherList,
    isLoading: selectTeachersIsLoading,
    isLoaded: state => selectIsTeachersLoaded(state)
});

const mapDispatchToProps = dispatch => ({
    fetchTeachersAsync: () => dispatch(fetchTeachersAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherListOverview);
