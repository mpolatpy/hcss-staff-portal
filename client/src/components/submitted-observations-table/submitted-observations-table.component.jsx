
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { mapObservationData } from './submitted-observations-table.utils'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .teacher-list-header': {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.info.contrastText
        },
        '& a': {
            textDecoration: 'none'
        }
    }
}));

const SubmittedObservationsTable = ({observations, baseUrl}) => {
    const classes = useStyles();
    const rows = observations.length? observations.map( observation => mapObservationData(observation) ) : [];
    const observationColumns = [
        {field: 'teacher', headerName: 'Teacher', headerClassName: 'teacher-list-header', flex: 1.5,
            renderCell: (params) => ( 
                <Link to={`${baseUrl.replace('observations/submitted', 'staff')}/home/${params.value.id}`} >
                    {params.value.name}
                </Link>
            ),
            sortComparator: (v1, v2, param1, param2) => {
                const name1 = param1.row.teacher.name.toLowerCase();
                const name2 = param2.row.teacher.name.toLowerCase();
                if( name1 < name2 ){
                    return -1;
                } 
                if( name1 > name2 ){
                    return 1;
                } 
                return 0;
            }
        },
        { field: 'weeklyObservations', headerName: 'Weekly Observations',headerClassName: 'teacher-list-header', flex: 1, 
            renderCell: (params) => ( 
                <Link to={`${baseUrl}/weekly/${params.value.id}`} >
                    {params.value.count}
                </Link>
            ),
        },
        { field: 'fullClassObservation', headerName: 'Full Class Observations', headerClassName: 'teacher-list-header',flex: 1,
            renderCell: (params) => ( 
                <Link to={`${baseUrl}/full-class/${params.value.id}`} >
                    {params.value.count}
                </Link>
            ),
        },
        { field: 'quarterEvaluation', headerName: 'Quarterly Evaluation', headerClassName: 'teacher-list-header',flex: 1,
            renderCell: (params) => (
                <Link to={`${baseUrl}/quarterly/${params.value.id}`} >
                    {params.value.count}
                </Link>
            ),
        },
        { field: 'midyearEvalaution', headerName: 'Midyear Evaluation', headerClassName: 'teacher-list-header',flex: 1,
            renderCell: (params) => ( 
                <Link to={`${baseUrl}/midyear/${params.value.id}`} >
                    {params.value.count}
                </Link>
            ),
        },
        { field: 'endOfYearEvaluation', headerName: 'End of Year Evaluation', headerClassName: 'teacher-list-header',flex: 1,
            renderCell: (params) => ( 
                <Link to={`${baseUrl}/endyear/${params.value.id}`} >
                    {params.value.count}
                </Link>
            ),
        },
    ];

    return ( 
        <div className={classes.root}>
            <div style={{ height: 450, width: '100%', margin: '10px 0 10px 0' }}>
                <DataGrid rows={rows} columns={observationColumns} />
            </div>
        </div>
    );

}

export default SubmittedObservationsTable;

