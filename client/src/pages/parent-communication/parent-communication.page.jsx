import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from "../../redux/school-year/school-year.selectors";
import DataTable from '../../components/custom-table/custom-table.component';
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    dataTable: {
        '& .teacher-list-header': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText
        },
        marginTop: theme.spacing(2),
    },
}));

const ParentCommunicationPage = ({currentUser, currentYear}) => {
    const [communications, setCommunications ] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const classes = useStyles();

    useEffect(() =>{
        setLoading(true);

        const fetchSchoolYears = async () => {
            const ref = firestore.collection('years');
            const snapshot = await ref.get();
            const years = {};
            if(!snapshot.empty){
                snapshot.docs.forEach(doc => years[doc.id] = doc.data());
            }

            return years;
        };

        const fetchCommunications = async () => {
            const teacherName = `${currentUser.lastName}, ${currentUser.firstName}`;
            const schoolYears = await fetchSchoolYears();
            const schoolYear = schoolYears[currentYear];
            const queryParam = `LOG.entry_author==${teacherName};Log.entry_date=ge=${schoolYear.start_date}`;

            try{
                const response = await axios({
                    url: '/get-powerschool-data',
                    method: 'post',
                    data: {
                        url: 'https://hcss.powerschool.com/ws/schema/query/com.hcss.admin.parent_communication',
                        queryParam: queryParam
                    }
                })
                if(response.data && response.data.status === 'success') setCommunications(response.data.result);
            } catch(e){
                console.log(e);
            }
        };

        fetchCommunications();
        setLoading(false);
    }, []);

    const rows = communications.map( (communication, i) => ({
        id: i,
        ...communication
    }));

    const columns = [
        {field: 'entry_date', headerName: 'Date', headerClassName: 'teacher-list-header', flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleDateString('en-US')
        },
        {field: 'student_number', headerName: 'ID', headerClassName: 'teacher-list-header', flex: 1,},
        {field: 'lastfirst', headerName: 'Name', headerClassName: 'teacher-list-header', flex: 1.5,},
        {field: 'grade_level', headerName: 'Grade', headerClassName: 'teacher-list-header', flex: 1,},
        {field: 'name', headerName: 'Category', headerClassName: 'teacher-list-header', flex: 1.5,},
        {field: 'subtype', headerName: 'Type', headerClassName: 'teacher-list-header', flex: 1,},
        {field: 'entry', headerName: 'Entry', headerClassName: 'teacher-list-header', flex: 4,},
    ];

    return (
        <div>
            <Typography variant="h5">Parent Communication</Typography>
            {
                isLoading ? (
                    <CircularProgress />
                ) : ( 
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
                )
            }   
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear
});

export default connect(mapStateToProps)(ParentCommunicationPage);