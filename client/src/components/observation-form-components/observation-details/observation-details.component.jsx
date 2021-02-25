import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CustomSelect from '../../custom-select/custom-select.component';
import DatePicker from '../../date-picker/date-picker.component';
import WithSpinner from '../../with-spinner/with-spinner.component';
import { 
    selectTeachersIsLoading, 
    selectTeacherOptions,
    selectTeachersObjWithNameKeys
 } from '../../../redux/teachers/teachers.selectors';
import { fetchTeachersAsync } from '../../../redux/teachers/teachers.actions';

import { useStyles } from './observation-details.styles';

const ObservationFormDetails = (props) => {
    const classes = useStyles();
    const { 
        observationDetails,
        currentUser, 
        setObservationFormDetails, 
        fetchTeachersAsync,
        teachers,
        teacherOptions,
        readOnly      
     } = props;
    
    const [selectedTeacher, setSelectedTeacher] = useState('');

    useEffect(() => { 
        if (teacherOptions.length === 0) {
            fetchTeachersAsync();
        } 
        if(observationDetails.teacher){
            setSelectedTeacher(`${observationDetails.teacher.lastName}, ${observationDetails.teacher.firstName}`)
        }

    }, [teacherOptions, observationDetails])


    const handleChange = e => {
        const { name, value } = e.target;

        if (name === 'teacher') {
            setSelectedTeacher(value);
            setObservationFormDetails({
                ...observationDetails,
                teacher: teachers[value]
            });
        } else {
            setObservationFormDetails({
                ...observationDetails,
                [name]: value
            });
        }
    };

    const handleDateChange = (date) => {
        setObservationFormDetails({
            ...observationDetails,
            observationDate: date
        });
    };


    return ( 
        <div className={classes.root}>
            <div className={classes.newDivMain} >
                <div className={classes.newDiv}>
                    <div className={classes.form_items}>
                        <DatePicker
                            readOnly={readOnly}
                            handleDateChange={handleDateChange}
                            selectedDate={
                                observationDetails.observationDate ?
                                observationDetails.observationDate :
                                null
                            }
                            name="observationDate"
                            label="Observation Date"
                            variant="outlined"
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            required
                            readOnly={readOnly}
                            label="Observation Type"
                            name="observationType"
                            handleSelect={handleChange}
                            value={observationDetails.observationType}
                            options={[
                                'Weekly Observation',
                                'Full Class Observation',
                                'Quarter Evaluation',
                                'Midyear Evaluation',
                                'End of Year Evaluation'
                            ]}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            required
                            readOnly={readOnly}
                            // variant="outlined"
                            label="Department"
                            name="department"
                            handleSelect={handleChange}
                            value={observationDetails.department}
                            options={[
                                'ELA',
                                'Math',
                                'Humanities',
                                'Science',
                                'Special Services'
                            ]}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            required
                            readOnly={readOnly}
                            label="School"
                            name="school"
                            handleSelect={handleChange}
                            value={observationDetails.school}
                            options={[
                                'HCSS East',
                                'HCSS West',
                            ]}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            required
                            readOnly={readOnly}
                            name="teacher"
                            label="Teacher"
                            handleSelect={handleChange}
                            value={selectedTeacher}
                            options={teacherOptions}
                        />
                    </div>
                </div>
                <div className={classes.newDiv}>
                    <div className={classes.form_items}>
                        <CustomSelect
                            required
                            readOnly={readOnly}
                            name="observer"
                            label="Observer"
                            // handleSelect={handleChange}
                            value={`${currentUser.lastName}, ${currentUser.firstName}`}
                            options={[`${currentUser.lastName}, ${currentUser.firstName}`]}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            readOnly={readOnly}
                            name="block"
                            label="Block"
                            handleSelect={handleChange}
                            value={observationDetails.block}
                            options={[1, 2, 3, 4, 5]}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            readOnly={readOnly}
                            name="course"
                            label="Course"
                            handleSelect={handleChange}
                            value={observationDetails.course}
                            options={[1, 2, 3]}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            readOnly={readOnly}
                            name="partOfTheClass"
                            label="Part of the Class"
                            handleSelect={handleChange}
                            value={observationDetails.partOfTheClass}
                            options={["Beginning", "Middle", "End", "Full Class"]}
                        />
                    </div>
                </div>
            </div>
        </div>
                    
                         
    );
}

const mapStateToProps = createStructuredSelector({
    isLoading: selectTeachersIsLoading,
    teacherOptions: selectTeacherOptions,
    teachers: selectTeachersObjWithNameKeys,
});

const mapDispatchToProps = dispatch => ({
    fetchTeachersAsync: () => dispatch(fetchTeachersAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(WithSpinner(ObservationFormDetails));