import { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeachers } from '../../redux/teachers/teachers.selectors';
import DataTable from '../../components/custom-table/custom-table.component';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import withAuthorization from '../../components/with-authorization/withAuthorization.component';

const useStyles = makeStyles((theme) => ({
    dataTable: {
        '& .MuiDataGrid-columnsContainer': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        },
        marginTop: theme.spacing(2),
    },
    link: {
        textDecoration: 'none'
    }
}));

const LessonPlanReport = ({currentUser, currentYear, teachers}) => {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [allRows, setAllRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        const fetchLessonPlanSummary = async () => {
            setIsLoading(true);
            let fetchedLessonPlanSummary = [];
            const snapshot = await firestore.collection(`lessonPlanScores/${currentYear}/summary`).get();

            if(!snapshot.empty){
                snapshot.docs.forEach(doc => {
                    fetchedLessonPlanSummary = [...fetchedLessonPlanSummary, doc.data()]
                });
            }
            const lessonPlans = fetchedLessonPlanSummary.sort((a, b) => {
                                    let teacher1 = teachers[a.teacherId];
                                    let teacher2 = teachers[b.teacherId];

                                    if(teacher1.lastName > teacher2.lastName){
                                        return 1;
                                    }
                                    return -1;
                                }).map((lesson, index) => {
                                    const teacher = teachers[lesson.teacherId];
                                    return ( {
                                        id: index,
                                        teacher: teacher,
                                        school: teacher.school,
                                        department: teacher.department,
                                        numScores: lesson.percentSubmitted.numScores,
                                        percentSubmitted: lesson.percentSubmitted.rate.toFixed(1),
                                        onTime: lesson.onTime.rate.toFixed(1)
                                    }
                                )});
            setRows(lessonPlans);
            setAllRows(lessonPlans);
            setIsLoading(false);
        };

        fetchLessonPlanSummary();
    }, [currentYear, teachers]);

    const columns = [
        {field: 'teacher', headerName: 'Teacher', flex: 1.5,
            renderCell: param => ( 
                <Link to={`/staff/lesson-plans/${param.value.id}`} className={classes.link}>
                   {`${param.value.lastName}, ${param.value.firstName}`}
                </Link>
            )
        },
        {field: 'school', headerName: 'School', flex: 1,},
        {field: 'department', headerName: 'Department', flex: 1,},
        {field: 'numScores', headerName: '# of Scores', flex: 1,},
        {field: 'percentSubmitted', headerName: '% Submitted', flex: 1,},
        {field: 'onTime', headerName: 'On Time', flex: 1,},
    ];

    const handleChange = (e) => {
        const {value} = e.target;
        setSearch(value);

        const filteredRows = allRows.filter( row => {
            const val = value.toLowerCase();
            const t = row.teacher;
            return ( 
                t.firstName.toLowerCase().includes(val) || 
                t.lastName.toLowerCase().includes(val) ||
                t.school.toLowerCase().includes(val) ||
                t.department.toLowerCase().includes(val) 
            );
        });

        setRows(filteredRows);
    }


    return (
        <div >
            <Typography variant="h5" style={{marginBottom: '10px'}}>Lesson Plans - Report</Typography>
            <TextField onChange={handleChange} value={search} label="Search" fullWidth size="small" variant="outlined" />
            <div className={classes.dataTable}>
            <DataTable
                customStyle = {{ height: 510, overflowX: 0 }}
                rows={isLoading? [] : rows}
                columns={columns}
                rowHeight={40}
                pageSize={10}
                loading={isLoading}
                rowsPerPageOptions={[5,10,25,100]}
            />
            </div>
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    teachers: selectTeachers
});

export default connect(mapStateToProps)(withAuthorization(['superadmin', 'admin', 'dci'])(LessonPlanReport));