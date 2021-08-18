import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

import { getObservationOptions } from './observation-details.utils';
import CustomSelect from '../../custom-select/custom-select.component';
import DatePicker from '../../date-picker/date-picker.component';
import {selectIsSavedObservation, selectObservationFormDetails} from '../../../redux/observation-form/observation-form.selectors';
import { selectTeacherOptions, selectTeachersObjWithNameKeys } from '../../../redux/teachers/teachers.selectors';
import { selectCurrentYear } from '../../../redux/school-year/school-year.selectors';
import ObservationInfoModal from '../../observation-info-modal/observation-info.component';
import { useStyles } from './observation-details.styles';

const ObservationFormDetails = (props) => {
    const classes = useStyles();
    const { 
        observationDetails,
        currentUser, 
        setObservationFormDetails, 
        teachers,
        teacherOptions,
        teacherList,
        currentYear,
        readOnly      
     } = props;

    const [ state, setState ] = useState({
        courses: [],
        options: [], 
        canvasId: null
    }); 

    const canvasId = observationDetails.teacher && observationDetails.teacher.canvasId;
    const observationOptions = getObservationOptions(currentUser);
    
    const getCourses = async (id) => {
        let courses =[];

        try{
            const response = await axios.post('/canvas-courses', {
                    teacherId: id,
                }
            );
            const fetchedCourses  = response.data;
            courses = fetchedCourses.filter ( 
                course => course.enrollments[0].type === 'teacher' && !course.name.includes('SandBox')
            ); 
        }catch(e){
            console.log(e.message);
        }
        return courses;
    }
    
    useEffect(() => { 
        if(observationDetails.teacher){

            setState({
                ...state,
                canvasId: observationDetails.teacher.canvasId
            });

            getCourses(observationDetails.teacher.canvasId).then(
                fetchedCourses => setState({
                    ...state,
                    courses: fetchedCourses,
                    options: fetchedCourses.map( c => c.name)
            }));
        }

        return () => {
            setState({
                courses: [],
                options: [], 
                canvasId: null
            });
        }
        
    },[observationDetails.teacher, canvasId]);

    const handleChange = async e => {
        const { name, value } = e.target;
        if (name === 'teacher') {
            const selectedTeacher = teachers[value];
            if (selectedTeacher){
                getCourses(selectedTeacher.canvasId)
                .then(fetchedCourses => setState({
                    courses: fetchedCourses,
                    options: fetchedCourses.map( c => c.name)
                }))
                .then(() => setObservationFormDetails({
                    ...observationDetails,
                    teacher: selectedTeacher,
                    department: selectedTeacher.department,
                    school: selectedTeacher.school
                }));
            } 
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
                        />
                        {
                            !readOnly &&
                            <ObservationInfoModal 
                            teacher={observationDetails.teacher}
                            currentYear={currentYear}
                            courses={state.courses}
                            />
                        }
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            required
                            readOnly={readOnly}
                            label="Observation Type"
                            name="observationType"
                            handleSelect={handleChange}
                            value={observationDetails.observationType}
                            options={observationOptions}
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
                </div>
                <div className={classes.newDiv}>
                    <div className={classes.form_items}>
                        <CustomSelect
                            required
                            readOnly={readOnly}
                            name="observer"
                            label="Observer"
                            // handleSelect={handleChange}
                            value={ observationDetails.observer ?
                                `${observationDetails.observer.lastName}, ${observationDetails.observer.firstName}`:
                                `${currentUser.lastName}, ${currentUser.firstName}`}
                            options={[(observationDetails.observer ?
                                `${observationDetails.observer.lastName}, ${observationDetails.observer.firstName}`:
                                `${currentUser.lastName}, ${currentUser.firstName}`)]}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            readOnly={readOnly}
                            disabled={
                                ['Quarter Evaluation',
                                'Midyear Evaluation',
                                'End of Year Evaluation'
                                ].includes(observationDetails.observationType)}
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
                            disabled={
                                ['Quarter Evaluation',
                                'Midyear Evaluation',
                                'End of Year Evaluation'
                                ].includes(observationDetails.observationType)}
                            name="course"
                            label="Course"
                            handleSelect={handleChange}
                            options={ state.options }
                            value={observationDetails.course}
                        />
                    </div>
                    <div className={classes.form_items}>
                        <CustomSelect
                            readOnly={readOnly}
                            disabled={
                                ['Quarter Evaluation',
                                'Midyear Evaluation',
                                'End of Year Evaluation'
                                ].includes(observationDetails.observationType)}
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
    teacherOptions: selectTeacherOptions,
    teachers: selectTeachersObjWithNameKeys,
    isSavedObservation: selectIsSavedObservation,
    currentYear: selectCurrentYear,
    observationDetails: selectObservationFormDetails, 
});

export default connect(mapStateToProps)(ObservationFormDetails);