import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getObservationOptions, sectionOptions } from './observation-details.utils';
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
        currentYear,
        readOnly      
     } = props;

    const observationOptions = getObservationOptions(currentUser);
    let teacher = observationDetails.teacher;
    let courses = teacher ? teacher.courses : [];
    let options = courses.map(course => course.name);

    const handleChange = async e => {
        const { name, value } = e.target;
        if (name === 'teacher') {
            const selectedTeacher = teachers[value];

            setObservationFormDetails({
                ...observationDetails,
                teacher: selectedTeacher,
                department: (selectedTeacher && selectedTeacher.department) || '',
                school: (selectedTeacher && selectedTeacher.school) || ''
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
                            courses={courses}
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
                            options={ options }
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
                            name="section"
                            label="Section"
                            handleSelect={handleChange}
                            value={observationDetails.section || ''}
                            options={sectionOptions}
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