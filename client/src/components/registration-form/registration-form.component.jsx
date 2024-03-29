import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CustomSelect from '../custom-select/custom-select.component';
import WithSpinner from '../with-spinner/with-spinner.component';
import useStyles from "./register.styles";
import options from './register.options';

const RegistrationForm = (props) => {
    const classes = useStyles();
    const { staff, handleSubmit, handleChange, submissionMessage, updateCourses, isUpdating } = props;
    const { departmentOptions, schoolOptions, roleOptions } = options;

    return (
        <div className={classes.root}>
            {submissionMessage &&
                <Alert severity={submissionMessage.type}>
                    {submissionMessage.text}
                </Alert>
            }
            <Grid className={classes.mainContainer} container>
                <Grid item sm={7}>
                    <form className={classes.inputContainer} onSubmit={handleSubmit}>
                        <Typography align="justify" variant="h5" mb={10}>
                            <strong>
                                {isUpdating ? 'Edit' : 'Add New'} Staff Member
                            </strong>
                        </Typography>
                        <TextField
                            required
                            className={classes.textInput}
                            onChange={handleChange}
                            value={staff.firstName}
                            type="text"
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                        />
                        <TextField
                            required
                            className={classes.textInput}
                            onChange={handleChange}
                            value={staff.lastName}
                            type="text"
                            name="lastName"
                            label="Last Name"
                            variant="outlined"
                        />
                        <TextField
                            required
                            className={classes.textInput}
                            onChange={handleChange}
                            value={staff.email}
                            type="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                        />
                        {
                            !isUpdating && (
                                <TextField
                                    required
                                    className={classes.textInput}
                                    value={staff.password}
                                    onChange={handleChange}
                                    type="password"
                                    name="password"
                                    label="Password"
                                    variant="outlined"
                                />
                            )
                        }
                        <CustomSelect
                            required
                            label="Department"
                            name="department"
                            value={staff.department}
                            handleSelect={handleChange}
                            options={departmentOptions}
                            variant="outlined"
                        />
                        <CustomSelect
                            required
                            label="School"
                            name="school"
                            value={staff.school}
                            handleSelect={handleChange}
                            options={schoolOptions}
                            variant="outlined"
                        />
                        <TextField
                            required
                            className={classes.textInput}
                            onChange={handleChange}
                            value={staff.jobTitle}
                            type="text"
                            name="jobTitle"
                            label="Job Title"
                            variant="outlined"
                        />
                        <TextField
                            required
                            className={classes.textInput}
                            onChange={handleChange}
                            value={staff.canvasId}
                            type="text"
                            name="canvasId"
                            label="Canvas ID"
                            variant="outlined"
                        />
                        <TextField
                            required
                            className={classes.textInput}
                            onChange={handleChange}
                            value={staff.powerSchoolId}
                            type="text"
                            name="powerSchoolId"
                            label="PowerSchool ID"
                            variant="outlined"
                        />
                        <CustomSelect
                            required
                            label="Role"
                            name="role"
                            value={staff.role}
                            handleSelect={handleChange}
                            options={roleOptions}
                            variant="outlined"
                        />
                        {
                            isUpdating && (
                                <CustomSelect
                                    required
                                    label="Is Teacher Active"
                                    name="isActive"
                                    value={staff.isActive ? 'Active' : 'Not Active'}
                                    handleSelect={handleChange}
                                    options={['Active', 'Not Active']}
                                    variant="outlined"
                                />
                            )
                        }
                        {/* <div className={classes.button}> */}
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            size="large"
                            style={{ width: '30vw', minWidth: 270, }}
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </Button>
                        {/* </div> */}
                    </form>
                </Grid>
                <Grid item className={classes.courses} sm={4}>
                    <Typography variant="h5" style={{ marginBottom: '20px' }}>Courses</Typography>
                    {
                        staff.courses && staff.courses.map(course => (
                            <Typography key={course.id}>{course.name}</Typography>
                        ))
                    }
                    <Button
                        disabled={isNaN(staff.canvasId) || staff.canvasId === ''}
                        color="primary"
                        onClick={() => updateCourses(staff.canvasId)}
                        style={{ textTransform: "none", marginTop: '20px' }}
                        variant="outlined"
                    >
                        Update Courses
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default WithSpinner(RegistrationForm);