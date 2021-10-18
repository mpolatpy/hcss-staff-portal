import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectFilteredTeacherList } from '../../redux/teachers/teachers.selectors';
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import { createMeetingNotificationEmail, createGoogleCalendarEvent } from './calendar-utils';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
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
        minHeight: '200px',
        padding: '12px 20px',
        borderRadius: '4px',
        fontSize: '16px',
        marginTop: theme.spacing(2),
        backgroundColor: "inherit"
    },
    autoComplete: {
        width: '40vw',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    header: {
        textAlign: 'center'
    },
    buttonContainer: {
        marginLeft: theme.spacing(7),
        marginTop: theme.spacing(2),
    },
}));

const MeetingForm = ({ teachers, currentUser, currentYear, setSubmissionMessage, history, match }) => {
    const classes = useStyles();
    const ref = match.params.meetingId;
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customFrequency, setCustomFrequency] = useState(false);
    const [form, setForm] = useState({
        title: '',
        block: '',
        location: '',
        startDateTime: new Date(),
        duration: '',
        notes: '',
        meetingLink: '',
        selectedTeachers: [],
        repeating: false,
        notifyGuests: false,
        addToGoogleCalendar: false,
        hoursMinutes: 'minutes',
        repeatFrequency: 1,
        endDate: null
    });

    useEffect(() => {

        const fetchFormData = async (ref) => {
            const snapshot = await firestore.doc(`meetings/${currentUser.id}/${currentYear}/${ref}`).get();
            if (snapshot.exists) {
                const formData = snapshot.data();
                const { startDateTime, endDate, repeatFrequency} = formData;

                if(endDate) formData.endDate = new Date(endDate.toDate());
                if(repeatFrequency > 1) setCustomFrequency(true);

                setForm({
                    ...formData,
                    startDateTime: new Date(startDateTime.toDate()),
                    repeatFrequency: repeatFrequency
                });
            }
        }

        if (ref) {
            setEditing(true);
            fetchFormData(ref);
        }
    }, [currentUser, currentYear]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleDateChange = (name, date) => {
        console.log(new Date(date).toISOString());
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

    const handleDelete = async () => {
        if (!editing) return;

        try {
            await firestore.doc(`meetings/${currentUser.id}/${currentYear}/${ref}`).delete();
            setSubmissionMessage({
                content: 'Sucessfully deleted meeting',
                status: 'success'
            })
            history.push('/calendar');
        } catch (e) {
            console.log(e.message);
            setSubmissionMessage({
                content: e.message,
                status: 'error'
            })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let googleCalendarEventId;

            if (form.addToGoogleCalendar && !editing) {
                const { res, status } = await createGoogleCalendarEvent(currentUser, form);
                
                if (status === 'success') {
                    googleCalendarEventId = res.data.id;
                }
            }

            const batch = firestore.batch();
            if (editing) {
                const { submittedAt } = form;
                const updateRef = firestore.doc(`meetings/${currentUser.id}/${currentYear}/${ref}`)
                updateRef.update({
                    ...form,
                    submittedAt,
                    updatedAt: new Date()
                });
            } else {
                const ref = firestore.collection(`meetings/${currentUser.id}/${currentYear}`).doc();
                const meeting = {
                    ...form,
                    submittedAt: new Date()
                };
                console.log(googleCalendarEventId);
                if(googleCalendarEventId){
                    meeting['googleCalendarEventId'] = googleCalendarEventId;
                }

                ref.set(meeting);
            }

            if (form.notifyGuests && form.selectedTeachers.length > 0 && !form.addToGoogleCalendar) {

                const to = form.selectedTeachers.reduce((acc, teacher) => {
                    acc += `, ${teacher.email}`;
                    return acc;
                }, currentUser.email);

                const email = createMeetingNotificationEmail(to, currentUser, form);
                const emailRef = firestore.collection("emails").doc();
                emailRef.set(email);
            }
            await batch.commit();


            setSubmissionMessage({
                content: editing ? 'Successfully updated meeting' : 'Successfully created meeting',
                status: 'success'
            });

            history.push('/calendar');
        } catch (e) {
            console.log(e.message)
            setSubmissionMessage({
                content: e.message,
                status: 'error'
            });
            setLoading(false);
        }
    };

    return (
        loading ? (
            <CircularProgress />
        ) : (
            <>
                <div className={classes.root}>
                    <Typography className={classes.header} variant="h4">{editing ? 'Edit Meeting' : 'New Meeting'}</Typography>
                    <Divider />
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <div className={classes.formContainer}>
                            <div style={{ marginLeft: '50px', width: '35vw' }}>
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
                                    options={['B1', 'B2', 'B3', 'B4', 'B5', 'SH', 'After School']}
                                    variant="outlined"
                                />
                                <div className={classes.formContainer}>
                                    <TextField
                                        required
                                        error={isNaN(form.duration) || form.duration.includes(' ')}
                                        helperText="Enter numbers only"
                                        style={{ width: '14vw', margin: '10px', }}
                                        onChange={handleChange}
                                        value={form.duration}
                                        type="text"
                                        name="duration"
                                        label="Duration"
                                        variant="outlined"
                                    />
                                    <span>
                                        <CustomSelect
                                            required
                                            label="Hours/Minutes"
                                            name="hoursMinutes"
                                            style={{ width: '9vw', minWidth: '5vw' }}
                                            value={form.hoursMinutes}
                                            handleSelect={handleChange}
                                            options={['minutes', 'hours']}
                                            variant="outlined"
                                        />
                                    </span>
                                </div>
                                <TextField
                                    className={classes.textInput}
                                    onChange={handleChange}
                                    value={form.location}
                                    type="text"
                                    name="location"
                                    label="Location"
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textInput}
                                    onChange={handleChange}
                                    value={form.meetingLink}
                                    type="text"
                                    name="meetingLink"
                                    label="Meeting Link"
                                    variant="outlined"
                                />
                            </div>
                            <div>
                                <Autocomplete
                                    multiple
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    value={form.selectedTeachers}
                                    id="meeting-guests"
                                    options={teachers}
                                    disableCloseOnSelect
                                    size="small"
                                    limitTags={3}
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
                                <div className={classes.formContainer}>
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
                                        label="Add to Google Calendar"
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
                                        label="Recurring"
                                    />
                                </div>
                                {
                                    form.repeating && (
                                        <>
                                            <Typography><strong>Repeat Frequency:</strong></Typography>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={form.repeatFrequency === 1}
                                                        onChange={() => setForm({
                                                            ...form,
                                                            repeatFrequency: 1
                                                        })}
                                                        name="repeating"
                                                        color="primary"
                                                    />
                                                }
                                                label="Weekly"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={customFrequency}
                                                        onChange={() => {
                                                            setCustomFrequency(!customFrequency);
                                                            setForm({
                                                                ...form,
                                                                repeatFrequency: form.repeatFrequency === 1 ? 2 : 1
                                                            })
                                                        }}
                                                        name="repeating"
                                                        color="primary"
                                                    />
                                                }
                                                label="Custom"
                                            />
                                            {

                                                customFrequency && (
                                                    <Typography>
                                                        Every
                                                        <span style={{
                                                            margin: '0 20px 0 20px',
                                                            display: 'inline-block',
                                                            verticalAlign: 'middle',
                                                            lineHeight: 'normal'
                                                        }}>
                                                            <TextField
                                                                size="small"
                                                                required={form.repeating}
                                                                style={{ width: '60px' }}
                                                                onChange={handleChange}
                                                                value={form.repeatFrequency}
                                                                type="text"
                                                                name="repeatFrequency"
                                                                label=""
                                                                variant="outlined"
                                                            />
                                                        </span>
                                                        weeks until
                                                        <span>
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <KeyboardDateTimePicker
                                                                    value={form.endDate}
                                                                    name="endDate"
                                                                    style={{
                                                                        marginLeft: '20px',
                                                                        width: '13vw'
                                                                    }}
                                                                    onChange={(date) => handleDateChange('endDate', date)}
                                                                    label="End Date"
                                                                    onError={console.log}
                                                                    minDate={new Date("2018-01-01T00:00")}
                                                                    format="MM/dd/yyyy"
                                                                    size="small"
                                                                    inputVariant="outlined"
                                                                />
                                                            </MuiPickersUtilsProvider>
                                                        </span>
                                                    </Typography>
                                                )}
                                        </>
                                    )
                                }
                                <TextareaAutosize
                                    placeholder="Notes"
                                    aria-label="meeting-notes"
                                    value={form.notes}
                                    name="notes"
                                    className={classes.meetingNotes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className={classes.buttonContainer}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                style={{ minWidth: '80px' }}
                            >
                                Save
                            </Button>
                            {
                                editing && (
                                    <Button
                                        onClick={handleDelete}
                                        variant="outlined"
                                        style={{ marginLeft: '20px' }}
                                        color="secondary"
                                    >
                                        Delete
                                    </Button>
                                )
                            }
                        </div>
                    </form>
                </div>
            </>
        )
    )
};

const mapStateToProps = createStructuredSelector({
    teachers: selectFilteredTeacherList,
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
});

const mapDispatchToProps = dispatch => ({
    setSubmissionMessage: message => dispatch(setSubmissionMessage(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingForm);