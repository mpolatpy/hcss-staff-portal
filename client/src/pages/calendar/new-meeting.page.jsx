import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeacherList } from '../../redux/teachers/teachers.selectors';
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';

import CustomSelect from '../../components/custom-select/custom-select.component';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        padding: theme.spacing(5),
    },
    textInput: {
        width: '25vw',
        margin: theme.spacing(1),
    },
    select: {
        width: '25vw'
    },
    form: {
        marginTop: theme.spacing(2),
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    dateField: {
        margin: theme.spacing(1),
        width: '25vw'
    },
    meetingNotes: {
        width: '40vw',
        padding: '12px 20px',
        borderRadius: '4px',
        fontSize: '16px',
        marginTop: theme.spacing(2)
    },
    autoComplete: {
        width: '40vw',
        marginTop: theme.spacing(2)
    },
    header: {
        textAlign: 'center'
    },
    buttonContainer: {
        marginLeft: theme.spacing(7),
        marginTop: theme.spacing(2),
        width: '25vw'
    }
}));

const MeetingForm = ({ teachers, currentUser, currentYear, setSubmissionMessage, formData, ...otherParams }) => {
    const classes = useStyles();
    console.log(otherParams);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        block: '',
        location: '',
        startDateTime: new Date(),
        duration: '',
        notes: '',
        selectedTeachers: [],
        repeating: false,
        notifyGuests: false,
        addToGoogleCalendar: false
    });

    useEffect(() => {
        if (formData) {
            setEditing(true);
            setForm(formData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleDateChange = (name, date) => {
        setForm({
            ...form,
            [name]: new Date(date)
        });
    };

    const handleTeachersSelect = (e, values) => {
        setForm({
            ...form,
            selectedTeachers: values
        });
    };

    const handlePreferences = (e) => {
        const { name } = e.target;
        setForm({
            ...form,
            [name]: !form[name]
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const ref = firestore.collection(`meetings/${currentUser.id}/${currentYear}`).doc();
            if (editing) {
                const { submittedAt } = formData;
                ref.update({
                    ...form,
                    submittedAt,
                    updatedAt: new Date()
                });
            } else {
                ref.set({
                    ...form,
                    submittedAt: new Date()
                });
            }

            setSubmissionMessage({
                content: editing ? 'Successfully updated meeting' : 'Successfully created meeting',
                status: 'success'
            });
            const {history} = otherParams;
            history.push('/calendar');
        } catch (e) {
            console.log(e.message)
            setSubmissionMessage({
                content: e.message,
                status: 'error'
            })
        } 


    };

    return (
        <>
            <div className={classes.root}>
                <Typography className={classes.header} variant="h4">{editing ? 'Edit Meeting' : 'New Meeting'}</Typography>
                <Typography>Under Construction - Do not use this page yet.</Typography>
                <Divider />
                <form className={classes.form} onSubmit={handleSubmit}>
                    <div className={classes.formContainer}>
                        <div style={{ marginLeft: '50px' }}>
                            <TextField
                                required
                                className={classes.textInput}
                                onChange={handleChange}
                                value={form.title}
                                type="text"
                                name="title"
                                label="Title"
                                variant="outlined"
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    value={form.startDateTime}
                                    name="startDateTime"
                                    className={classes.dateField}
                                    onChange={(date) => handleDateChange('startDateTime', date)}
                                    label="Start Date and Time"
                                    onError={console.log}
                                    minDate={new Date("2018-01-01T00:00")}
                                    format="MM/dd/yyyy hh:mm a"
                                    inputVariant="outlined"
                                />
                            </MuiPickersUtilsProvider>
                            <CustomSelect
                                required
                                label="Block"
                                name="block"
                                className={classes.select}
                                value={form.block}
                                handleSelect={handleChange}
                                options={['B1', 'B2', 'B3', 'B4', 'B5', 'SH']}
                                variant="outlined"
                            />
                            <TextField
                                className={classes.textInput}
                                onChange={handleChange}
                                value={form.duration}
                                type="text"
                                name="duration"
                                label="Duration"
                                variant="outlined"
                            />
                            <TextField
                                className={classes.textInput}
                                onChange={handleChange}
                                value={form.location}
                                type="text"
                                name="location"
                                label="Location"
                                variant="outlined"
                            />
                        </div>
                        <div>
                            <Autocomplete
                                multiple
                                getOptionSelected={(option, value) => option.id === value.id}
                                value={form.selectedTeachers}
                                id="selected-observation-templates"
                                options={teachers}
                                disableCloseOnSelect
                                onChange={handleTeachersSelect}
                                className={classes.autoComplete}
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
                                        {`${option.lastName}, ${option.firstName}`}
                                    </React.Fragment>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Guests" placeholder="Guests" />
                                )}
                            />
                            <TextareaAutosize
                                placeholder="Notes"
                                aria-label="meeting-notes"
                                minRows={8}
                                value={form.notes}
                                name="notes"
                                className={classes.meetingNotes}
                                onChange={handleChange}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.repeating}
                                        onChange={handlePreferences}
                                        name="repeating"
                                        color="primary"
                                    />
                                }
                                label="Weekly Meeting"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.notifyGuests}
                                        onChange={handlePreferences}
                                        name="notifyGuests"
                                        color="primary"
                                    />
                                }
                                label="Notify Guests"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.addToGoogleCalendar}
                                        onChange={handlePreferences}
                                        name="addToGoogleCalendar"
                                        color="primary"
                                    />
                                }
                                label="Add To Google Calendar"
                            />
                        </div>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button fullWidth variant="contained" color="primary" type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </>
    )
};

const mapStateToProps = createStructuredSelector({
    teachers: selectTeacherList,
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
});

const mapDispatchToProps = dispatch => ({
    setSubmissionMessage: message => dispatch(setSubmissionMessage(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingForm);