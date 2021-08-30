import { useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectTeacherList, selectTeachersIsLoading } from "../../redux/teachers/teachers.selectors";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add';
import {DataGrid} from '@material-ui/data-grid';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiDataGrid-columnsContainer': {
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
    const [teachers, setTeachers ] = useState(teacherList);
    const [search, setSearch] = useState('');

    const rows = teachers.map( teacher => ({
        name: {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            id: teacher.id
        },
        role: teacher.role,
        department: teacher.department,
        email: teacher.email,
        school: teacher.school,
        status: teacher.isActive ? 'Active' : 'Inactive',
        id: teacher.id
    }));
    
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1.5, 
            renderCell: (params) => ( 
                <Link to={`staff/home/${params.value.id}`} >
                    {`${params.value.lastName}, ${params.value.firstName}`}
                </Link>
            ),
            sortComparator: (v1, v2, param1, param2) => {
                const lastName1 = param1.row.name.lastName.toLowerCase();
                const lastName2 = param2.row.name.lastName.toLowerCase();
                if( lastName1 < lastName2 ){
                    return -1;
                } 
                if( lastName1 > lastName2 ){
                    return 1;
                } 
                return 0;
            }
        },
        { field: 'department', headerName: 'Department', flex: 1, },
        { field: 'school', headerName: 'School', flex: 1, },
        { field: 'email', headerName: 'Email', flex: 1.5, },
        { field: 'status', headerName: 'Status', flex: 1,},
    ];

    const handleChange = (e) => {
        let {value} = e.target;
        setSearch(value);

        const teachers = teacherList.filter( teacher => {
            value = value.toLowerCase();
            const lastNameMatch  = teacher.lastName.toLowerCase().includes(value);
            const firstNameMatch  = teacher.firstName.toLowerCase().includes(value);
            const schoolMatch  = teacher.school.toLowerCase().includes(value);
            const departmentMatch  = teacher.department.toLowerCase().includes(value);
            
            return (lastNameMatch || firstNameMatch || schoolMatch || departmentMatch );
        });

        setTeachers(teachers);
    }

    

    return ( 
        <div className={classes.root}>
            {
                currentUser.role === 'superadmin' ? 
                (<div className={classes.addUser}>
                    <Button  variant="outlined" onClick={() => history.push('/register')} >
                        <AddIcon/> Add New User
                    </Button>
                </div> )
                : null
            }
            <TextField onChange={handleChange} value={search} label="Search" fullWidth size="small" variant="outlined" />
            <div style={{ height: 650, width: '100%', marginTop:'10px'}}>
                <DataGrid 
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                // hideFooter
                />
            </div>
        </div>
    );
}

const Directory = ({ match, teacherList, currentUser, isLoading }) => {

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
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    teacherList: selectTeacherList,
    isLoading: selectTeachersIsLoading
});

export default connect(mapStateToProps)(Directory);