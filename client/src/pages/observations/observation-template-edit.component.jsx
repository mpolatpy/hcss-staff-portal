import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectTeacherList } from '../../redux/teachers/teachers.selectors';
import { useStyles } from './observation-template.styles';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



 const ObservationTemplateEditPage = ({ teachers, currentUser }) => {
    const [selectedTeachers, setSelectedTeachers ] = useState([]);
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

    const handleSaveSelection = async () => {
        const ref = firestore.doc(`observationTemplates/${currentUser.id}`);
        setIsLoading(true);
        try{
           await ref.set({teachers: selectedTeachers});
        }catch (e) {
            console.log(e.message)
        }  
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
            <Typography variant="h5">Update Selected Teachers</Typography>  
            <Divider/>
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
            </div>
            <div className={classes.items}>
                <Button variant="outlined" color="primary" onClick={handleSaveSelection}>Save Selection</Button>    
            </div>
        </div>
        )
    );
}

const mapStateToProps = createStructuredSelector({
    teachers: selectTeacherList,
    currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(withRouter(ObservationTemplateEditPage));
