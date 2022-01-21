import { useEffect, useState } from 'react';
import { firestore } from '../../firebase/firebase.utils';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    accordion: {
        boxShadow: 'none',
        backgroundColor: theme.palette.background.default
    },
    accordionHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    accordionSummary: {
        borderBottom: 'none',
        boxShadow: '0'
    },
    accordionDetails: {
        minWidth: '80%',
    }
}));

const MentorMeetings = ({ currentYear }) => {
    const [meetings, setMeetings] = useState(null);
    const classes = useStyles();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getObserverIds = async () => {
            const usersRef = firestore.collection('users')
                .where('role', '==', 'dci')

            const snapshot = await usersRef.get();

            const observerIds = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.firstName !== 'Test') {
                    observerIds.push({
                        id: doc.id,
                        observer: data.lastFirst
                    });
                }
            });

            return observerIds;
        };

        const getAllMentorMeetings = async () => {
            const observerIds = await getObserverIds();
            let meetings = {};

            for (let { id, observer } of observerIds) {
                let mentorMeetings = [];
                const mentorMeetingRef = firestore.collection(`meetings/${id}/${currentYear}`);
                const mentorMeetingSnapshot = await mentorMeetingRef.get();
                mentorMeetingSnapshot.forEach(doc => {
                    const meeting = doc.data();
                    if (meeting.title.toLowerCase().includes('mentor') || meeting.title.toLowerCase().includes('progress')) {
                        mentorMeetings.push(meeting);
                    }
                });

                meetings[observer] = mentorMeetings;
            }
            console.log(meetings);
            setMeetings(meetings);
            setLoading(false);
        };

        getAllMentorMeetings();
    }, [currentYear]);

    const tableHeader = ['Date', 'Teacher', 'Title'];

    if(loading){
        return(
            <CircularProgress />
        )
    }

    return (
        <div>
            <Typography variant="h5">Mentor Meetings</Typography>
            <hr />
            {
                meetings && (
                    Object.keys(meetings).map(admin => {
                        const adminMeetings = meetings[admin]
                            .map(meeting => {
                                const teachers = meeting.selectedTeachers;
                                const teacherName = teachers.length ? teachers[0].lastFirst : 'NA'
                                const date = meeting.startDateTime.toDate().toLocaleString();
                                const title = meeting.title;

                                return [date, teacherName, title];
                            })

                        if (!adminMeetings.length) {
                            return null;
                        }

                        return (
                            <div key={admin} className={classes.root}>
                                <Accordion className={classes.accordion}>
                                    <AccordionSummary
                                        className={classes.accordionSummary}
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-label="Expand"
                                        aria-controls="additional-actions1-content"
                                        id={`action-header-for-${admin}`}
                                    >
                                        <div className={classes.accordionHeader}>
                                            <Typography>{admin}</Typography>
                                            <Typography variant="caption">{adminMeetings.length} meetings</Typography>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className={classes.accordionDetails}>
                                            <CustomSpreadSheetTable
                                                header={tableHeader}
                                                records={adminMeetings}
                                            />
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        )
                    })
                )
            }
        </div>
    );
};

export default MentorMeetings;