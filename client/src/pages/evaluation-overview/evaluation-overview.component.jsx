import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase/firebase.utils';
import { Link } from 'react-router-dom';
import WithSpinnner from '../../components/with-spinner/with-spinner.component';
import DataTable from '../../components/custom-table/custom-table.component';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Typography } from '@material-ui/core';
import { useStyles } from './evaluation-overview.styles';
import CustomSelect from '../../components/custom-select/custom-select.component';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { observationTypeMap, applyStyles, 
    RenderRating, Render_Rating, createRows } from './evaluation-overview.utils';

const DataTableWithSpinner = WithSpinnner(DataTable);

const EvaluationOverview = ({ match }) => {

    const [observationScores, setObservationScores] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ observation, setObservation ] = useState({
        type: 'weeklyObservationScores',
        value: 'Weekly Observation'
    });

    const [isShowingNumbers, setIsShowingNumbers] = useState(false);

    const handleToggle = (e) => {
        setIsShowingNumbers(!isShowingNumbers);
    }

    const observationTypes = Object.keys(observationTypeMap);
    const classes = useStyles();

    useEffect(() => {
        const observationScoresRef = firestore.collection(observation.type);
        setIsLoading(true);
        const unsubscribe = observationScoresRef.onSnapshot( snapshot => {
            const fetchedData = snapshot.docs.map(doc => doc.data());
            setObservationScores(fetchedData);
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
            console.log('unsubscribe done')
        }
    }, [observation]);

    const rows = createRows(observationScores);

    const columns = [
        { field: 'id', headerName: 'Details', cellClassName: 'openInNew', 
            headerClassName: 'teacher-list-header',
            renderCell: (params) => (
                    <Link
                        to={`${match.path}/${params.value}`}
                    >
                        <OpenInNewIcon size="small" />
                    </Link>
            ),
            width: 50
        },
        { field: 'name', headerName: 'Name', flex: 1.5, headerClassName: 'teacher-list-header', },
        { field: 'department', headerName: 'Department', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'school', headerName: 'School', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'email', headerName: 'Email', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'domainOne', headerName: 'Domain I', flex: 1, headerClassName: 'teacher-list-header',
            cellClassName: params => applyStyles(params),
            renderCell: (params) => Render_Rating(params, isShowingNumbers)
        },
        { field: 'domainTwo', headerName: 'Domain II', flex: 1, headerClassName: 'teacher-list-header',
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, isShowingNumbers)
        },
        { field: 'domainThree', headerName: 'Domain III', flex: 1, headerClassName: 'teacher-list-header', 
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, isShowingNumbers)
        },
        { field: 'domainFour', headerName: 'Domain IV', flex: 1, headerClassName: 'teacher-list-header', 
            cellClassName:params => applyStyles(params),
            renderCell: (params) => Render_Rating(params, isShowingNumbers)
        },
    ];

    const handleSelect = (e) => {
        const value = e.target.value;
        const type = observationTypeMap[value];
        setObservation({type: type, value: value});
    };

    return ( 
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.headerText}>
                    <Typography variant="h5">Evaluation Data</Typography>
                </div>
                <div>
                    <CustomSelect
                        label="Observation Type"
                        // variant="outlined"
                        style={{ width: 150 }}
                        options={observationTypes}
                        name="observationType"
                        value={observation.value}
                        handleSelect={handleSelect}
                     />
                </div>
            </div>
            <DataTableWithSpinner
                isLoading={isLoading} 
                rows={rows}
                rowHeight={45}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5,10,25,100]}
            />
            <div>
            <FormControlLabel
                control={<Switch checked={isShowingNumbers} onChange={handleToggle} color="primary" name="toggleShowNumbers" />}
                label="Show Domain Averages"
            />
            </div>
        </div>
    );
};

export default EvaluationOverview;