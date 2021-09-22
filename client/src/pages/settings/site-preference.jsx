import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectDepartmentPreference, selectSchoolPreference } from '../../redux/user/user.selectors';
import { setSchoolPreference, setDepartmentPreference } from '../../redux/user/user.actions';

import CustomSelect from '../../components/custom-select/custom-select.component';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const SitePreferences = ({ schoolPreference, departmentPreference, setSchoolPreference, setDepartmentPreference }) => {

    const [showSchool, setShowSchool] = useState(false);
    const [showDepartment, setShowDepartment] = useState(false);

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

    const handleChange = (e) => {
        const { name } = e.target;
        if (name === 'school') {
            setShowSchool(!showSchool);
        } else if (name === 'department') {
            setShowDepartment(!showDepartment)
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
                            onChange={handleChange}
                            name="school"
                            color="primary"
                        />
                    }
                    label={`Edit school view option for HCSS Staff Portal - Preference: ${schoolPreference ? schoolPreference : 'Both Schools'}`}
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
                            onChange={handleChange}
                            name="department"
                            color="primary"
                        />
                    }
                    label={`Edit department view option for HCSS Staff Portal - Preference: ${departmentPreference ? departmentPreference : 'All'}`}
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
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    schoolPreference: selectSchoolPreference,
    departmentPreference: selectDepartmentPreference
});

const mapDispatchToProps = dispatch => ({
    setSchoolPreference: school => dispatch(setSchoolPreference(school)),
    setDepartmentPreference: department => dispatch(setDepartmentPreference(department))
});

export default connect(mapStateToProps, mapDispatchToProps)(SitePreferences);