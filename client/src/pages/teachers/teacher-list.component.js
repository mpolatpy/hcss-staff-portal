import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import DataTable from '../../components/custom-table/custom-table.component';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .teacher-list-header': {
            backgroundColor: theme.palette.info.dark,
            color: theme.palette.info.contrastText
        },
    },
}));

const TeacherTableContainer = ({ teacherList, match }) => {

    const classes = useStyles();

    const rows = teacherList.map( teacher => ({
        avatar: `${teacher.firstName.substring(0, 1)}${teacher.lastName.substring(0, 1)}`,
        name: `${teacher.lastName}, ${teacher.firstName}`,
        role: teacher.role,
        department: teacher.department,
        email: teacher.email,
        school: teacher.school,
        id: teacher.id
    }));
    
    const columns = [
        {
            field: 'avatar', headerName: 'Initials', flex: 0.5, headerClassName: 'teacher-list-header',
            renderCell: (params) => 
                <Avatar 
                    style={{ width: '32px', height: '32px', backgroundColor: deepOrange[500] }}
                >
                <p style={{ fontSize: '14px'}}>{params.value}</p>
                </Avatar>
        },
        { field: 'name', headerName: 'Name', flex: 1.5, headerClassName: 'teacher-list-header', },
        { field: 'role', headerName: 'Role', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'department', headerName: 'Department', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'school', headerName: 'School', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'email', headerName: 'Email', flex: 1.5, headerClassName: 'teacher-list-header', },
        { 
            field: 'id', 
            headerName: 'Details', 
            headerClassName: 'teacher-list-header',
            renderCell: (params) => (
                    <Button
                        // onClick={() => {
                        // console.log(`${match.path}/${params.value}`)
                        //     history.push(`${match.path}/${params.value}`)}}
                        // variant="contained"
                        component={Link}
                        to={`${match.path}/${params.value}`}
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
            <DataTable 
            rows={rows}
            columns={columns}
            pageSize={3}
            // checkboxSelection
            />
        </div>
    );
}

export default withRouter(TeacherTableContainer);