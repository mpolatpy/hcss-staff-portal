import React, { useEffect } from 'react';
import { withRouter, Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectTeacherList, selectTeachersIsLoading, selectIsTeachersLoaded } from "../../redux/teachers/teachers.selectors";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'
import { fetchTeachersAsync } from '../../redux/teachers/teachers.actions';
import AddIcon from '@material-ui/icons/Add';
import {DataGrid} from '@material-ui/data-grid'
import UserRegistrationPage from '../../pages/register/register.component';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .teacher-list-header': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText
        },
    },
    addUser: {
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-end'
    }
}));

const TeacherTableContainer = ({ teacherList, history, currentUser }) => {

    const classes = useStyles();

    const rows = teacherList.map( teacher => ({
        name: `${teacher.lastName}, ${teacher.firstName}`,
        role: teacher.role,
        department: teacher.department,
        email: teacher.email,
        school: teacher.school,
        id: teacher.id
    }));
    
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1.5, headerClassName: 'teacher-list-header', },
        { field: 'department', headerName: 'Department', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'school', headerName: 'School', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'email', headerName: 'Email', flex: 1.5, headerClassName: 'teacher-list-header', },
        { 
            field: 'id', 
            headerName: 'Details', 
            headerClassName: 'teacher-list-header',
            renderCell: (params) => (
                    <Button
                        component={Link}
                        to={`staff/${params.value}`}
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                    >
                        details
                    </Button>
            ),
            width: 200
        }
    ]

    return ( 
        <div className={classes.root}>
            {
                currentUser.role === 'superadmin' ? 
                (<div className={classes.addUser}>
                    <Button color="primary" onClick={() => history.push('/register')} >
                        <AddIcon/> Add User
                    </Button>
                </div> )
                : null
            }
            
            <div style={{ height: 650, width: '100%'}}>
                <DataGrid 
                rows={rows}
                columns={columns}
                pageSize={10}
                // hideFooter
                />
            </div>
            
        </div>
    );
}

const Directory = ({ match, teacherList, currentUser, isLoading, fetchTeachersAsync }) => {

    useEffect(() => {
        fetchTeachersAsync();
    }, [])

    console.log(match)

    return ( 
        <>
        <Route 
            exact 
            path={`${match.path}`} 
            render={(props) =>  <TeacherTableContainer
                                    currentUser={currentUser} 
                                    isLoading={isLoading} 
                                    teacherList={teacherList}
                                    {...props}
                                />
                    }
        />
        {/* <Route path={`${match.path}/register`} component={UserRegistrationPage} /> */}
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    teacherList: selectTeacherList,
    isLoading: selectTeachersIsLoading,
    isLoaded: state => selectIsTeachersLoaded(state)
});

const mapDispatchToProps = dispatch => ({
    fetchTeachersAsync: () => dispatch(fetchTeachersAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(Directory);