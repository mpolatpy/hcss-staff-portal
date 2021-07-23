import React from 'react';
import { connect } from 'react-redux';
import { selectTeacher } from '../../redux/teachers/teachers.selectors';
import { Typography, Divider } from '@material-ui/core';
import TeacherHomeComponent from '../../components/teacher-home/teacher-home.component';

const TeacherDetails = ({teacher, ...otherProps} ) => {

    return (
        <div >
            <Typography variant="h6">{`Teacher - ${teacher.firstName} ${teacher.lastName}`}</Typography>
            <Divider/>
            <TeacherHomeComponent teacher={teacher} {...otherProps}/>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
})

export default connect(mapStateToProps)(TeacherDetails);
