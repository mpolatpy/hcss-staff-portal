import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    selectDepartmentPreference,
    selectSchoolPreference,
    selectActiveTeacherPreference
} from '../../redux/user/user.selectors';
import {
    setSchoolPreference,
    setDepartmentPreference,
    setActiveTeacherPreference
} from '../../redux/user/user.actions';

import CustomSelect from '../../components/custom-select/custom-select.component';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const SitePreferences = ({
    schoolPreference,
    departmentPreference,
    activeTeacherPreference,
    setSchoolPreference,
    setDepartmentPreference,
    setActiveTeacherPreference
}) => {
    const [showSchool, setShowSchool] = useState(false);
    const [showDepartment, setShowDepartment] = useState(false);
    const [showActiveTeacherChoice, setShowActiveTeacherChoice] = useState(false);

    const handleSchoolSelect = (e) => {
        const { value } = e.target;
        if (value === 'Both Schools') {
            setSchoolPreference(null);
        } else {
            setSchoolPreference(value);
        }
    }

    const handleDepartmentSelect = (e) => {
        const { value } = e.target;
        if (value === 'All') {
            setDepartmentPreference(null)
        } else {
            setDepartmentPreference(value);
        }
    } 

    const handleActiveTeacherSelect = (e) => {
        const { value } = e.target;

        if (value === 'Active Only') {
            setActiveTeacherPreference(true);
        } else if (value === 'Active and Inactive') {
            setActiveTeacherPreference(false);
        }
    }

    return (
        <div>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={showSchool}
                            onChange={() => setShowSchool(!showSchool)}
                            name="school"
                            color="primary"
                        />
                    }
                    label={`Edit School Preference - Current Preference: ${schoolPreference ? schoolPreference : 'Both Schools'}`}
                />
                {
                    showSchool &&
                    (
                        <CustomSelect
                            required
                            label="Show teachers only in"
                            name="school"
                            style={{ width: '20vw', minWidth: '200px' }}
                            // className={classes.select}
                            value={schoolPreference || 'Both Schools'}
                            handleSelect={handleSchoolSelect}
                            options={['Both Schools', 'HCSS East', 'HCSS West']}
                            variant="outlined"
                        />
                    )
                }
            </div>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={showDepartment}
                            onChange={() => setShowDepartment(!showDepartment)}
                            name="department"
                            color="primary"
                        />
                    }
                    label={`Edit Department Preference - Current Preference: ${departmentPreference ? departmentPreference : 'All'}`}
                />
                {
                    showDepartment &&
                    (
                        <CustomSelect
                            required
                            label="Show teachers only in"
                            name="department"
                            style={{ width: '20vw', minWidth: '200px' }}
                            value={departmentPreference || 'All'}
                            handleSelect={handleDepartmentSelect}
                            options={['All', 'ELA', 'Humanities', 'Math', 'Science', 'Special Services']}
                            variant="outlined"
                        />
                    )
                }
            </div>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={showActiveTeacherChoice}
                            onChange={() => setShowActiveTeacherChoice(!showActiveTeacherChoice)}
                            name="activeTeacherChoice"
                            color="primary"
                        />
                    }
                    label={`Edit Teacher Selection Preference - Current Preference: ${activeTeacherPreference ? 'Active Only' : 'Active and Inactive'}`}
                />
                {
                    showActiveTeacherChoice &&
                    (
                        <CustomSelect
                            required
                            label="Teacher Selection"
                            name="school"
                            style={{ width: '20vw', minWidth: '200px' }}
                            value={activeTeacherPreference ?  'Active Only' : 'Active and Inactive'}
                            handleSelect={handleActiveTeacherSelect}
                            options={['Active Only', 'Active and Inactive']}
                            variant="outlined"
                        />
                    )
                }
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    schoolPreference: selectSchoolPreference,
    departmentPreference: selectDepartmentPreference,
    activeTeacherPreference: selectActiveTeacherPreference
});

const mapDispatchToProps = dispatch => ({
    setSchoolPreference: school => dispatch(setSchoolPreference(school)),
    setDepartmentPreference: department => dispatch(setDepartmentPreference(department)),
    setActiveTeacherPreference: choice => dispatch(setActiveTeacherPreference(choice))
});

export default connect(mapStateToProps, mapDispatchToProps)(SitePreferences);