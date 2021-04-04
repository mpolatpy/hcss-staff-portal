import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectTeacherList } from '../../redux/teachers/teachers.selectors';
import CustomSelect from '../../components/custom-select/custom-select.component';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider'
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Typography } from '@material-ui/core';
import { useStyles } from './observation-template.styles';
import { INITIAL_STATE } from '../../redux/observation-form/observation-form.reducer';
import { saveObservationForm } from '../../redux/observation-form/observation-form.actions';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

 const ObservationTemplatesPage = ({ teachers, currentUser, saveObservationForm, currentYear, history }) => {
    const observationForm = { ...INITIAL_STATE };
    const [selectedTeachers, setSelectedTeachers ] = useState([]);
    const [observationType, setObservationType] = useState('');
    const [updatingSelection, setUpdatingSelection] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSelectedTeachers = async () => {
            const ref = firestore.doc(`observationTemplates/${currentUser.id}`);
            const snapshot = await ref.get();

            if (snapshot.exists){
                const fetchedData = snapshot.data();
                if(Object.keys(fetchedData).includes('teachers')){
                    setSelectedTeachers(fetchedData.teachers)
                }
            }
        };

        fetchSelectedTeachers();
    }, [currentUser.id]);

    const classes = useStyles();

    const handleChange = (e, values) => {
        setSelectedTeachers(values);
    }

    const handleSelect = (e) => {
        const { value } = e.target;
        setObservationType(value);
    }

    const handleSave = () => {
        setIsLoading(true);
        selectedTeachers.forEach ( teacher => {
            const observation = {
                ...observationForm,
                observationDetails: {
                    observationDate: new Date(),
                    observationType: observationType,
                    schoolYear: currentYear,
                    observer: currentUser,
                    teacher: teacher,
                    school:teacher.school,
                    department: teacher.department,
                    block: '',
                    course: '',
                    partOfTheClass: ''
                }
            };
            saveObservationForm(observation);
        });
        setIsLoading(false);
        history.push('/observations')
    }

    const handleSaveSelection = async () => {
        const ref = firestore.doc(`observationTemplates/${currentUser.id}`);
        setIsLoading(true);
        try{
           await ref.set({teachers: selectedTeachers});
        }catch (e) {
            console.log(e.message)
        }  
        setUpdatingSelection(false);
        setIsLoading(false);
    }

    return (
        isLoading ?
        ( 
            <div className={classes.loading}>
                <CircularProgress />
            </div>
        ):
        (
        <div className={classes.root}>
            {
                updatingSelection ?
                    <Typography variant="h5">Update Selected Teachers</Typography> :
                    <Typography variant="h5">Save Observations for Selected Teachers</Typography>

            }
            <Divider/>
            {
                updatingSelection? (
                <div className={classes.items}>
                    <Autocomplete
                    multiple
                    getOptionSelected={(option, value) => option.id === value.id}
                    value={selectedTeachers}
                    id="selected-observation-templates"
                    options={teachers}
                    fullWidth
                    disableCloseOnSelect
                    onChange={handleChange}
                    getOptionLabel={(option) => `${option.lastName}, ${option.firstName}`}
                    renderOption={(option, { selected }) => (
                        <React.Fragment>
                        <Checkbox
                            icon={icon}
                            name={option.id}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        { `${option.lastName}, ${option.firstName}`}
                        </React.Fragment>
                    )}
                    renderInput={(params) => (
                        <TextField {...params}  label="Selected Teachers" placeholder="Observation List"/>
                    )}
                    />
                </div>):( 
                <div className={classes.items}>
                    {
                        (selectedTeachers.length > 0) ? ( 
                            <List>
                                {
                                    selectedTeachers.map( teacher => ( 
                                        <ListItem key={teacher.id}>
                                            {`${teacher.lastName}, ${teacher.firstName}` }
                                        </ListItem>
                                    ))
                                }
                            </List>
                        ) : ( 
                            <Typography>There is no selected teacher. Please update your selection.</Typography>
                        )
                    }  
                </div>    
                )
                }
                {
                    (updatingSelection || selectedTeachers.length === 0) ? 
                    null:
                    <div  className={classes.items}>
                        <CustomSelect
                            required
                            readOnly={false}
                            style={{ width: 340 }}
                            // variant="outlined"
                            label="Observation Type"
                            name="observationType"
                            handleSelect={handleSelect}
                            value={observationType}
                            options={[
                                'Weekly Observation',
                                'Full Class Observation',
                                'Quarter Evaluation',
                                'Midyear Evaluation',
                                'End of Year Evaluation'
                            ]}
                        />
                    </div>
                }
            <div className={classes.items}>
                {
                    updatingSelection? (
                    <Button variant="outlined" color="primary" onClick={handleSaveSelection}>Save Selection</Button>
                    ):( 
                    <div className={classes.buttons}>
                        <Button 
                        disabled={selectedTeachers.length===0 || observationType === ''}
                        variant="contained" 
                        color="primary" 
                        onClick={handleSave}>Save Observations</Button>
                        <Button variant="outlined" className={classes.button2} onClick={() => setUpdatingSelection(true)}>Update Selection</Button>
                    </div>
                    )
                } 
            </div>
        </div>
        )
    );
}

const mapStateToProps = createStructuredSelector({
    teachers: selectTeacherList,
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
});

const mapDispatchToProps = dispatch => ({
    saveObservationForm: observationForm => dispatch(saveObservationForm(observationForm))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ObservationTemplatesPage));
