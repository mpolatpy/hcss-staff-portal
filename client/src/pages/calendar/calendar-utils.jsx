import { firestore } from '../../firebase/firebase.utils';
import axios from 'axios';
import CustomPopper from '../../components/custom-popper/custom-popper.component';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    margin: {
        marginTop: 10,
        marginBottom: 5
    },
    link: {
        textDecoration: 'none'
    }
});

export const createWeeklyCalendar = async (selectedDate, currentYear, currentUser) => {
    const range = getWeekRange(selectedDate);
    const savedObservations = await fetchObservations('savedObservations', range, currentYear, currentUser);
    const submittedObservations = await fetchObservations('observations', range, currentYear, currentUser);
    const meetings = await fetchMeetings(currentYear, currentUser, range);
    const googleCalendarEvents = await fetchGoogleCalendar(currentUser, range);

    const blocks = [
        {
            name: 'B1',
            startTime: '07:50',
            endTime: '09:02'
        },
        {
            name: 'B2',
            startTime: '09:02',
            endTime: '10:13'
        },
        {
            name: 'B3',
            startTime: '10:13',
            endTime: '11:49'
        },
        {
            name: 'B4',
            startTime: '11:49',
            endTime: '13:00'
        },
        {
            name: 'B5',
            startTime: '13:00',
            endTime: '14:11'
        },
        {
            name: 'SH',
            startTime: '14:11',
            endTime: '14:55'
        },
    ];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const calendar = {};
    blocks.map(block => block.name)
        .forEach(
            (block) => calendar[block] = days.reduce((acc, current) => {
                acc[current] = [];
                return acc;
            }, {})
        );
    addObservationsToCalendar(calendar, savedObservations, 'Saved Observation');
    addObservationsToCalendar(calendar, submittedObservations, 'Observation');
    addMeetingsToCalendar(calendar, meetings);

    if (googleCalendarEvents) {
        addGoogleEventsToCalendar(calendar, googleCalendarEvents, blocks);
    }

    return calendar;
};

const addGoogleEventsToCalendar = (calendar, googleCalendarEvents, blocks) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    googleCalendarEvents.forEach(event => {
        if (!(event.start.dateTime)) return;

        const startDateTime = new Date(event.start.dateTime);
        const dayNumber = startDateTime.getDay();
        const day = days[dayNumber];

        const startTime = event.start.dateTime.split('T')[1].slice(0, 5);
        let block = null;

        for (let blck of blocks) {
            if (startTime >= blck.startTime && startTime <= blck.endTime) {
                block = blck.name;
                break;
            }
        }

        if (block) {
            calendar[block][day].push(
                <CustomPopper
                    displayName={event.summary}
                    backgroundColor="#87b9ed"
                >
                    <div>
                        <GoogleCalendarEventCard
                            event={event}
                            startDateTime={startDateTime}
                        />
                    </div>
                </CustomPopper>
            )
        }

    })
}

const GoogleCalendarEventCard = ({ event, startDateTime }) => {
    const classes = useStyles();

    return (
        <>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Google Calendar Event
                    </Typography>
                    <Typography variant="body2">
                        {`Starts @ ${startDateTime.toLocaleTimeString('en-US', { timeStyle: 'short' })}`}
                    </Typography>
                    <Typography variant="body2">
                        {`Ends @ ${(new Date(event.end.dateTime)).toLocaleTimeString('en-US', { timeStyle: 'short' })}`}
                    </Typography>
                    <Typography variant="body2">{`Organizer: ${event.organizer.email}`}</Typography>

                    {
                        event.attendees && (
                            <>
                                <Typography className={classes.margin} variant="subtitle2">Guests</Typography>
                                <Divider />
                                <ul>
                                    {
                                        event.attendees.map((teacher, i) => (
                                            <li key={`teacher-${i}`}>
                                                <Typography variant="body2">{`${teacher.email}`}</Typography>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </>
                        )
                    }
                </CardContent>
                <CardActions>
                    <a href={event.htmlLink} className={classes.link} target="_blank" rel="noopener noreferrer">
                        <Button
                            color="primary"
                            size="small"
                        >
                            View Event in Google Calendar
                        </Button>
                    </a>
                </CardActions>
            </Card>
        </>
    );
}

const fetchGoogleCalendar = async (currentUser, range) => {
    const [start, end] = range;
    const tokenRef = firestore.doc(`googleCalendar/${currentUser.id}`);
    const tokenSnaphot = await tokenRef.get();

    if (!tokenSnaphot.exists) {
        return;
    }
    const token = tokenSnaphot.data();
    const resp = await axios.post('/list-calendar-events', {
        token,
        timeMin: start,
        timeMax: end
    });
    const { status, result } = resp.data;

    return status === 'success' ? result : null;
}

const fetchObservations = async (collectionName, range, currentYear, currentUser) => {
    const [start, end] = range;
    let fetchedObservations = [];
    try {
        const ref = firestore.collection(collectionName)
            .where('observationDetails.schoolYear', '==', currentYear)
            .where('observerId', '==', currentUser.id)
            .where('observationDate', '>=', start)
            .where('observationDate', '<=', end);
        const snapshot = await ref.get();
        fetchedObservations = snapshot.docs.map(doc => doc.data());
    } catch (e) {
        console.log(e);
    }

    return fetchedObservations;
};

const fetchMeetings = async (currentYear, currentUser, range) => {
    const [start, end] = range;
    let meetings = [];
    try {
        const ref = firestore.collection(`meetings/${currentUser.id}/${currentYear}`)
            .where('startDateTime', '>=', start)
            .where('startDateTime', '<=', end);

        const snapshot = await ref.get();
        if (!snapshot.empty) {
            snapshot.docs.forEach(doc => meetings = [...meetings, { id: doc.id, ...doc.data() }]);
        }
        const meetingSet = new Set(meetings.map(meeting => meeting.id));
        const repeatingMeetingsRef = firestore.collection(`meetings/${currentUser.id}/${currentYear}`)
            .where('repeating', '==', true);
        const repeatingMeetingsSnapshot = await repeatingMeetingsRef.get();
        if (!repeatingMeetingsSnapshot.empty) {
            repeatingMeetingsSnapshot.docs.forEach(
                doc => {
                    if (!meetingSet.has(doc.id)) {
                        meetings = [...meetings, { id: doc.id, ...doc.data() }]
                    }
                }
            );
        }
    } catch (e) {
        console.log(e);
    }

    return meetings.filter(meeting => !meeting.addToGoogleCalendar);
};

const MeetingCard = ({ meeting }) => {
    const classes = useStyles();

    return (
        <>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {meeting.title}
                    </Typography>
                    <Typography variant="body2">
                        {`Starts @ ${meeting.startDateTime.toDate().toLocaleTimeString('en-US', { timeStyle: 'short' })}`}
                    </Typography>
                    <Typography variant="body2">{`Duration: ${meeting.duration} ${meeting.hoursMinutes}`}</Typography>
                    <Typography variant="body2">{`Location: ${meeting.location}`}</Typography>
                    {meeting.meetingLink && meeting.meetingLink !== '' && (
                        <Typography variant="body2">Click <a href={meeting.meetingLink} target="_blank" rel="noreferrer">here</a> to join online meeting</Typography>
                    )}
                    <Typography className={classes.margin} variant="subtitle2">Guests</Typography>
                    <Divider />
                    <ul>
                        {
                            meeting.selectedTeachers.map((teacher, i) => (
                                <li key={`teacher-${i}`}>
                                    <Typography variant="body2">{`${teacher.firstName} ${teacher.lastName}`}</Typography>
                                </li>
                            ))
                        }
                    </ul>
                </CardContent>
                <CardActions>
                    <Button
                        color="primary"
                        size="small"
                        component={Link}
                        to={`/calendar/meeting/${meeting.id}`}
                    >
                        View/Edit Meeting
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}

const ObservationCard = ({ type, observationType, teacherName, observation }) => {
    const classes = useStyles();
    const { observationDetails } = observation;

    return (
        <>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {type}
                    </Typography>
                    <Typography variant="body2">{`Teacher: ${teacherName}`}</Typography>
                    <Typography variant="body2">{observationType}</Typography>
                    <Typography variant="body2">{`Course: ${observationDetails.course}`}</Typography>
                    <Typography variant="body2">{`Section: ${observationDetails.section}`}</Typography>
                    {
                        observationDetails.partOfTheClass !== '' && (
                            <Typography variant="body2">{`Part of the class: ${observationDetails.partOfTheClass}`}</Typography>
                        )
                    }
                </CardContent>
                <CardActions>
                    {
                        (type === 'Saved Observation' || type === 'Observation') && (
                            <Button
                                color="primary"
                                size="small"
                                component={Link}
                                to={
                                    type === 'Saved Observation' ?
                                        `/observations/saved/${observation.firestoreRef.id}`
                                        : `/observations/submitted/observation/${observation.firestoreRef.id}`
                                }
                            >
                                Go to observation
                            </Button>
                        )
                    }
                </CardActions>
            </Card>
        </>
    );
}

const addObservationsToCalendar = (calendar, observations, type) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const blocks = { '1': 'B1', '2': 'B2', '3': 'B3', '4': 'B4', '5': 'B5' };

    for (let observation of observations) {
        const { block, observationDate, teacher, observationType } = observation.observationDetails;
        const teacherName = `${teacher.firstName} ${teacher.lastName}`;
        if (block === '') continue;
        const backgroundColor = type === 'Saved Observation' ? '#F8BFD7' : '#9bbab0';
        const selectedBlock = blocks[block];
        const day = days[observationDate.toDate().getDay()];

        calendar[selectedBlock][day].push(
            <CustomPopper
                displayName={`${type} - ${teacherName}`}
                backgroundColor={backgroundColor}
            >
                <div>
                    <ObservationCard
                        type={type}
                        observationType={observationType}
                        teacherName={teacherName}
                        observation={observation}
                    />
                </div>
            </CustomPopper>
        )
    }

};

const addMeetingsToCalendar = (calendar, meetings) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let meeting of meetings) {
        const { block, startDateTime } = meeting;
        const day = days[startDateTime.toDate().getDay()];
        calendar[block][day].push(
            <CustomPopper
                displayName={meeting.title}
                backgroundColor="#f7f1e4"
            >
                <div>
                    <MeetingCard
                        meeting={meeting}
                    />
                </div>
            </CustomPopper>
        )
    }
}

const getWeekRange = (selectedDate) => {
    const date = selectedDate.getDate();
    const day = selectedDate.getDay();
    const numOfMonday = date - day + (day === 0 ? -6 : 1);
    const start = new Date(selectedDate);
    start.setDate(numOfMonday);
    start.setHours(0);
    const end = new Date(start);
    end.setDate(start.getDate() + 5);

    return [start, end];
};

export const createMeetingNotificationEmail = (to, currentUser, form) => ({
    to: to,
    message: {
        subject: `Notification - Meeting`,
        text: `This is an automated meeting notificication.

Meeting Title: ${form.title}
Meeting Created by: ${currentUser.firstName} ${currentUser.lastName}

Here are the details:
Date: ${form.startDateTime.toLocaleDateString("en-US")}
Block: ${form.block}
Start time: ${form.startDateTime.toLocaleTimeString('en-US', { timeStyle: 'short' })}
Duration: ${form.duration} ${form.hoursMinutes}
${form.location ? `Location: ${form.location}` : ''}
${form.repeating ? 'This is a weekly meeting' : ''}
${form.notes === '' ? '' : `Notes: ${form.notes}`}
`,
    },
})

export const createGoogleCalendarEvent = async (currentUser, form) => {
    const event = createEvent(form);
    const tokenRef = firestore.doc(`googleCalendar/${currentUser.id}`);
    const tokenSnaphot = await tokenRef.get();

    if (!tokenSnaphot.exists) {
        return;
    }
    const token = tokenSnaphot.data();

    const resp = await axios.post('/create-calendar-event', {
        token,
        event,
        sendUpdates: form.notifyGuests
    });
    const status = resp.data;
    console.log(status);
    return status;
}

const createEvent = (form) => {
    const description = (form.notes + '\n' + form.meetingLink).trim();
    const endTime = new Date(form.startDateTime);
    if (form.hoursMinutes === 'minutes') {
        endTime.setMinutes(endTime.getMinutes() + parseInt(form.duration))
    } else {
        endTime.setHours(endTime.getHours() + parseInt(form.duration));
    }

    var event = {
        'summary': form.title,
        'location': form.location,
        'description': description,
        'start': {
            'dateTime': form.startDateTime.toISOString(),
            'timeZone': 'America/New_York',
        },
        'end': {
            'dateTime': endTime.toISOString(),
            'timeZone': 'America/New_York',
        },
    };

    if (form.repeating) {
        event['recurrence'] = ['RRULE:FREQ=WEEKLY']
    }

    if (form.selectedTeachers.length) {
        event['attendees'] = form.selectedTeachers.map(
            teacher => ({ email: teacher.email })
        );

        if (form.notifyGuests) {
            event['reminders'] = {
                useDefault: true
            }
        }
    }

    return event;
}
