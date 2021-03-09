import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

import CustomSelect from '../../custom-select/custom-select.component';
// import CustomAutocomplete from '../../custom-autocomplete/autocomplete.component';
import DatePicker from '../../date-picker/date-picker.component';
import WithSpinner from '../../with-spinner/with-spinner.component';
import {selectIsSavedObservation, selectObservationFormDetails} from '../../../redux/observation-form/observation-form.selectors';
import { 
    selectTeachersIsLoading, 
    selectTeacherOptions,
    selectTeacherList,
    selectTeachersObjWithNameKeys 
 } from '../../../redux/teachers/teachers.selectors';
import { selectCurrentYear } from '../../../redux/school-year/school-year.selectors';
import { fetchTeachersAsync } from '../../../redux/teachers/teachers.actions';
import OnservationInfoModal from '../../observation-info-modal/observation-info.component';
import { useStyles } from './observation-details.styles';

const ObservationFormDetails = (props) => {
    const classes = useStyles();
    const { 
        observationDetails,
        isSavedObservation, 
        currentUser, 
        setObservationFormDetails, 
        fetchTeachersAsync,
        teachers,
        // teachersList,
        teacherOptions,
        currentYear,
        readOnly      
     } = props;
    
    const [ courses, setCourses ] = useState([]);

    const getCourses = async (teacher) => {
        try{
            const response = await axios.post('/canvas-courses', {
                    teacherId: teacher.canvasId,
                }
            );
            const fetchedCourses  = response.data;
            const courses = fetchedCourses.filter ( 
                course => course.enrollments[0].type === 'teacher' && !course.name.includes('SandBox')
            );
            setCourses(courses);
        }catch(e){
            console.log(e.message);
        }

    }
    
    useEffect(() => { 
        const teacher = observationDetails.teacher;
        if (teacherOptions.length === 0) {
            fetchTeachersAsync();
        } 
        getCourses(teacher);     
    }, [observationDetails, teacherOptions, fetchTeachersAsync])

    const handleChange = e => {
        const { name, value } = e.target;

        if (name === 'teacher') {
            const teacher = teachers[value];
            setObservationFormDetails({
                ...observationDetails,
                teacher: teacher
            });
            getCourses(teacher);
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
                    <div className={classes.form_info}>
                        <DatePicker
                            required
                            readOnly={readOnly}
                            handleDateChange={handleDateChange}
                            selectedDate={
                                observationDetails.observationDate ?
                                observationDetails.observationDate :
                                null
                            }
                            name="observationDate"
                            label="Observation Date"
                            // variant="outlined"
                        />
                        <OnservationInfoModal 
                        teacher={observationDetails.teacher}
                        currentYear={currentYear}
                        courses={courses}
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
                            value={
                                observationDetails.teacher ?
                                `${observationDetails.teacher.lastName}, ${observationDetails.teacher.firstName}`
                                : ''
                            }
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
                            options={ courses.length > 0 ? courses.map( course => course.name) : []}
                            value={observationDetails.course}
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
    teachersList: selectTeacherList,
    isSavedObservation: selectIsSavedObservation,
    currentYear: selectCurrentYear,
    observationDetails: selectObservationFormDetails
});

const mapDispatchToProps = dispatch => ({
    fetchTeachersAsync: () => dispatch(fetchTeachersAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(WithSpinner(ObservationFormDetails));