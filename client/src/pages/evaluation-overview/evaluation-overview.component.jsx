import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';

import { firestore } from '../../firebase/firebase.utils';
import { Link } from 'react-router-dom';
import WithSpinnner from '../../components/with-spinner/with-spinner.component';
import DataTable from '../../components/custom-table/custom-table.component';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './evaluation-overview.styles';
import CustomSelect from '../../components/custom-select/custom-select.component';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import TextField from '@material-ui/core/TextField';
import { observationTypeMap, applyStyles, 
    RenderRating, createRows } from './evaluation-overview.utils';

const DataTableWithSpinner = WithSpinnner(DataTable);

const EvaluationOverview = ({ match, currentYear }) => {

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
        const observationScoresRef = firestore.collection(`observationScores/${currentYear}/${observation.type}`);
        setIsLoading(true);
        const unsubscribe = observationScoresRef.onSnapshot( snapshot => {
            const fetchedData = snapshot.docs.map(doc => doc.data());
            setObservationScores(fetchedData);
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
        }
    }, [observation, currentYear]);

    const rows = createRows(observationScores);

    const columns = [
        { field: 'id', headerName: 'Details', cellClassName: 'openInNew', 
            headerClassName: 'teacher-list-header',
            renderCell: (params) => (
                    <Link
                        to={`${match.path}/observations/${params.value}`}
                    >
                        <OpenInNewIcon fontSize="small" />
                    </Link>
            ),
            width: 50
        },
        { field: 'name', headerName: 'Name', flex: 1.5, headerClassName: 'teacher-list-header', },
        { field: 'department', headerName: 'Department', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'school', headerName: 'School', flex: 1, headerClassName: 'teacher-list-header', },
        { field: 'domainOne', headerName: 'Domain I', flex: 1, headerClassName: 'teacher-list-header',
            cellClassName: params => applyStyles(params),
            renderCell: (params) => RenderRating(params, isShowingNumbers)
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
            renderCell: (params) => RenderRating(params, isShowingNumbers)
        },
    ];

    const handleSelect = (e) => {
        const value = e.target.value;
        const type = observationTypeMap[value];
        setObservation({type: type, value: value});
    };

    return ( 
        <div className={classes.root}>
            {/* <Typography variant="h5">Evaluation Data</Typography> */}
            <div className={classes.header}>
                <Typography variant="h5">Evaluation Data</Typography>
                {/* <TextField label="Search" variant="outlined"  size="small"  /> */}
                <div className={classes.selectOptions}>
                    <CustomSelect
                        label="Observation Type"
                        // variant="outlined"
                        style={{ width: 150 }}
                        options={observationTypes}
                        name="observationType"
                        value={observation.value}
                        handleSelect={handleSelect}
                     />
                     <FormControlLabel
                        control={<Switch checked={isShowingNumbers} onChange={handleToggle} color="primary" name="toggleShowNumbers" />}
                        label="Show Averages"
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
        </div>
    );
};

const mapStateToProps = createStructuredSelector({ 
    currentYear: selectCurrentYear
})

export default connect(mapStateToProps)(EvaluationOverview);