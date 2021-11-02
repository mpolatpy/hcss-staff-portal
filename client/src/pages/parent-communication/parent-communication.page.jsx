import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from "../../redux/school-year/school-year.selectors";
import DataTable from '../../components/custom-table/custom-table.component';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles'
import CustomSelect from "../../components/custom-select/custom-select.component";

const useStyles = makeStyles((theme) => ({
    dataTable: {
        '& .MuiDataGrid-columnsContainer': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText
        },
        marginTop: theme.spacing(2),
    },
}));

const ParentCommunicationPage = ({ isLoading, match, communications, allStudents, total, currentUser, teacherList, teacher, setTeacher }) => {
    const classes = useStyles();
    const average = Object.keys(allStudents).length ? (total / Object.keys(allStudents).length) : 0;
    const rows = Object.keys(allStudents).map((student_number, i) => {
        const record = allStudents[student_number];
        const { name, grade, homeRoom, courses } = record;
        const count = (communications[student_number] && communications[student_number].length) || 0;

        return {
            id: i,
            count,
            student_number,
            lastfirst: name,
            grade_level: grade,
            homeRoom,
            courses: courses.reduce((acc, course) => {
                const val = `${course.courseName}-${course.section}`
                return `${acc} ${val}`
            }, '')
        }

    }).sort((a, b) => {
        if (a.homeRoom > b.homeRoom) {
            return 1;
        } else if (a.homeRoom < b.homeRoom) {
            return -1;
        } else {
            if (a.lastfirst > b.lastfirst) return 1;
            else return -1;
        }
    });

    const columns = [
        {
            field: 'student_number', headerName: 'ID', flex: 0.5,
            renderCell: param => (
                <Link to={`${match.path}/student/${param.value}`}>
                    {param.value}
                </Link>
            )
        },
        { field: 'lastfirst', headerName: 'Name', flex: 2, },
        { field: 'grade_level', headerName: 'Grade', flex: 1, },
        { field: 'homeRoom', headerName: 'Home Room', flex: 1, },
        { field: 'courses', headerName: 'Courses', flex: 2, },
        { field: 'count', headerName: 'Count', flex: 1, },
    ];

    const handleSelect = (e) => {
        const { value } = e.target;
        setTeacher(value);
    }

    return (
        <div>
            {
                currentUser.role !== 'teacher' ?
                    (
                        <Box
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <Typography variant="h5">Parent Communication</Typography>
                            {
                                teacherList && (<CustomSelect
                                    label="Teacher"
                                    style={{ width: 100, height: 40 }}
                                    options={teacherList}
                                    name="select_teacher"
                                    value={teacher}
                                    handleSelect={handleSelect}
                                />)
                            }
                        </Box>
                    ) : (
                        <Typography variant="h5">Parent Communication</Typography>
                    )
            }
            <div className={classes.dataTable}>
                <div>
                    <Typography variant="caption">{`Total Communications: ${total}`}</Typography>
                </div>
                <div>
                    <Typography variant="caption">{`Total Students: ${Object.keys(allStudents).length}`}</Typography>
                </div>
                <div>
                    <Typography variant="caption">{`Average: ${average.toFixed(2)}`}</Typography>
                </div>

                <DataTable
                    customStyle={{ height: 510, overflowX: 0, marginTop: '25px' }}
                    rows={isLoading ? [] : rows}
                    columns={columns}
                    rowHeight={40}
                    pageSize={10}
                    loading={isLoading}
                    rowsPerPageOptions={[5, 10, 25, 100]}
                />
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear
});

export default connect(mapStateToProps)(ParentCommunicationPage);