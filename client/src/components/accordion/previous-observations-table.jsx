import DataTable from '../custom-table/custom-table.component';
import { applyStyles, RenderRating } from '../../pages/evaluation-overview/evaluation-overview.utils';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    dataTable: {
        '& .teacher-list-header': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText
        },
        marginTop: theme.spacing(1),
    },
    switch: {
        display: 'flex',
        justifyContent: 'flex-start',
    },

}));

const PreviousObservationsTable = ({ observations, domainName, item }) => {
    const classes = useStyles();  

    const rows = observations
        .sort((a, b) => (b.observationDate.seconds - a.observationDate.seconds))
        .map((observation, i) => ({
            ...observation,
            id: i,
            observationDate: new Date(observation.observationDate.seconds * 1000).toLocaleDateString("en-US"),
            observer: observation.observationDetails.observer.lastFirst || '',
            score: observation[domainName][item]
        }));
        
    const observationColumns = [
        { field: 'observationDate', headerName: 'Date', headerClassName: 'teacher-list-header', flex: 0.8 },
        { field: 'observationType', headerName: 'Type', headerClassName: 'teacher-list-header', flex: 0.8 },
        { field: 'observer', headerName: 'Observer', headerClassName: 'teacher-list-header', flex: 1, },
        {
            field: 'score', headerName: 'Rating', headerClassName: 'teacher-list-header', flex: 1,
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, false)
        },
    ];

    return (
        <div className={classes.dataTable}>
            <DataTable
                customStyle={{ height: 500, width: '100%', overflowX: 0 }}
                rows={observations.length ? rows : []}
                rowHeight={35}
                columns={observationColumns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25, 100]}
            />
        </div>
    );
};

export default PreviousObservationsTable;