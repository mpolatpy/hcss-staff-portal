import { useState } from 'react';
import { Link } from "react-router-dom";
import DataTable from '../custom-table/custom-table.component';
import { applyStyles, RenderRating } from '../../pages/evaluation-overview/evaluation-overview.utils';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles'

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
        justifyContent: 'flex-end',  
    }
}));

const ObservationTableByType = ({observations}) => {
    const classes = useStyles();
    // console.log(observations.map( o => o.firestoreRef.id));

    const rows = observations.map( observation => ({
            id: observation.firestoreRef.id,
            date: {
                id: observation.firestoreRef.id,
                date: ( observation.observationDetails.observationDate ?
                new Date(observation.observationDetails.observationDate.seconds * 1000).toLocaleDateString("en-US") :
                new Date(observation.submittedAt.seconds * 1000).toLocaleDateString("en-US"))
            },
            course: observation.observationDetails.course,
            observer: `${observation.observationDetails.observer.firstName} ${observation.observationDetails.observer.lastName}`,
            domainOne: observation.observationScore? observation.observationScore.domainOne : null,
            domainTwo: observation.observationScore? observation.observationScore.domainTwo : null,
            domainThree: observation.observationScore? observation.observationScore.domainThree : null,
            domainFour: observation.observationScore? observation.observationScore.domainFour : null
    }));

    const observationColumns = [
        {field: 'date', headerName: 'Date', headerClassName: 'teacher-list-header', flex: 1,
            renderCell: (params) => ( 
                <Link to={`/observations/submitted/observation/${params.value.id}`} >
                    {params.value.date}
                </Link>
            ),
        },
        {field: 'course', headerName: 'Course', headerClassName: 'teacher-list-header', flex: 1.5,},
        {field: 'observer', headerName: 'Observer', headerClassName: 'teacher-list-header', flex: 1.2,},
        { field: 'domainOne', headerName: 'Domain I',headerClassName: 'teacher-list-header', flex: 1,
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, isShowingNumbers)
        },
        { field: 'domainTwo', headerName: 'Domain II',headerClassName: 'teacher-list-header', flex: 1,
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, isShowingNumbers)
        },
        { field: 'domainThree', headerName: 'Domain III',headerClassName: 'teacher-list-header', flex: 1,
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, isShowingNumbers)
        },
        { field: 'domainFour', headerName: 'Domain IV',headerClassName: 'teacher-list-header', flex: 1,
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, isShowingNumbers)
        },
    ];

    const [isShowingNumbers, setIsShowingNumbers] = useState(false);

    const handleToggle = (e) => {
        setIsShowingNumbers(!isShowingNumbers);
    }

    return (
        <div className={classes.dataTable}>
            <div className={classes.switch}>
                <FormControlLabel
                    control={<Switch checked={isShowingNumbers} onChange={handleToggle} color="primary" name="toggleShowNumbers" />}
                    label="Show Values"
                />
            </div>
            <DataTable
                rows={observations.length ? rows : []}
                rowHeight={45}
                columns={observationColumns}
                pageSize={10}
                rowsPerPageOptions={[5,10,25,100]}
            />
        </div>
    );
};

export default ObservationTableByType;