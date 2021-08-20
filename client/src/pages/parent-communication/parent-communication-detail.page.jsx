import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from "../../redux/school-year/school-year.selectors";
import DataTable from '../../components/custom-table/custom-table.component';
import { CircularProgress, Typography, Box } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'
import CustomSelect from "../../components/custom-select/custom-select.component";
const useStyles = makeStyles((theme) => ({
    dataTable: {
        '& .teacher-list-header': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText
        },
        marginTop: theme.spacing(2),
    },
})); 

const ParentCommunicationDetailPage = ({communications, students, isLoading, history, match}) => {
    const classes = useStyles();
    const communicationDetails = communications[match.params.studentId];
    const rows = communicationDetails && communicationDetails.map( (communication, i) => ({
        id: i,
        ...communication
    }));

    const student = students[match.params.studentId];
    const studentsMap = {};
    let options = [];

    for(let student of Object.values(students)){
        options = [...options, student.name];
        studentsMap[student.name] = student;
    }

    options.sort();

    const columns = [
        {field: 'entry_date', headerName: 'Date', headerClassName: 'teacher-list-header', flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleDateString('en-US')
        },
        // {field: 'lastfirst', headerName: 'Name', headerClassName: 'teacher-list-header', flex: 1.5,},
        // {field: 'grade_level', headerName: 'Grade', headerClassName: 'teacher-list-header', flex: 0.9,},
        {field: 'name', headerName: 'Category', headerClassName: 'teacher-list-header', flex: 1.2,},
        {field: 'subtype', headerName: 'Type', headerClassName: 'teacher-list-header', flex: 1.2,},
        {field: 'entry', headerName: 'Entry', headerClassName: 'teacher-list-header', flex: 6,},
    ];

    const handleSelect = (e) => {
        const {value} = e.target;
        const {student_number} = studentsMap[value];
        history.push(match.url.replace(match.params.studentId, student_number));
    };

    return (
        <div>
            <Box
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <Typography variant="h5">Parent Communication Details</Typography>
                    {
                        student && (
                            <CustomSelect
                                label="Student"
                                style={{ width: 100, height: 40 }}
                                options={options}
                                name="select_student"
                                value={student.name}
                                handleSelect={handleSelect}
                            />
                        )
                     }
                </Box>
            {
                isLoading ? (
                    <CircularProgress />
                ) : ( 
                    communicationDetails && communicationDetails.length > 0 ?
                    (
                    <div className={classes.dataTable}>
                        <DataTable
                            customStyle = {{ height: 510, width: '100%', overflowX: 0 }}
                            rows={rows}
                            columns={columns}
                            rowHeight={40}
                            pageSize={10}
                            rowsPerPageOptions={[5,10,25,100]}
                        />
                    </div>
                    ) : ( 
                        <div className={classes.dataTable}>
                            <Typography >No parent communication details found.</Typography>
                        </div>
                    )
                )
            }   
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear
});

export default withRouter(connect(mapStateToProps)(ParentCommunicationDetailPage));