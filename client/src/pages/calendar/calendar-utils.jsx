import { firestore } from '../../firebase/firebase.utils';
import CustomPopper from '../../components/custom-popper/custom-popper.component';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
  });

export const createWeeklyCalendar = async (selectedDate, currentYear, currentUser) => {
    const range = getWeekRange(selectedDate);
    const savedObservations = await fetchObservations('savedObservations', range, currentYear, currentUser);
    const submittedObservations = await fetchObservations('observations', range, currentYear, currentUser);
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
    const days = ['Mon','Tue','Wed','Thu','Fri'];
    const calendar = {};
    blocks.map(block => block.name)
        .forEach(
            (block) => calendar[block] = days.reduce((acc, current) => {
                acc[current]= [];
                return acc;
            }, {})
        );
    addObservationsToCalendar(calendar, savedObservations, 'Saved Observation');
    addObservationsToCalendar(calendar, submittedObservations, 'Observation');
    return calendar;
};

const fetchObservations = async (collectionName, range, currentYear, currentUser) => {
    const [start, end] = range;
    let fetchedObservations = [];
    try{
        const ref = firestore.collection(collectionName)
                        .where('observationDetails.schoolYear', '==', currentYear)
                        .where('observerId', '==', currentUser.id)
                        .where('observationDate', '>=', start)
                        .where('observationDate', '<=', end);
        const snapshot = await ref.get();
        fetchedObservations = snapshot.docs.map(doc => doc.data());
    } catch(e){
        console.log(e);
    }
    
    return fetchedObservations;
};

const fetchMeetings = async (currentYear, currentUser) => {
    let meetings = [];
    const snapshot = await firestore.collection(`meetings/${currentUser.id}/${currentYear}`).get();
    if (!snapshot.empty){
        snapshot.docs.forEach( doc => meetings = [...meetings, doc.data()]);
    }
    return meetings;
};

const ObservationCard = ({type, observationType, teacherName, observation}) => {
    const classes = useStyles();

    return (
        <>
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                {type}
                </Typography>
                {/* <Typography variant="h6" component="h2">
                {type}
                </Typography> */}
                <Typography variant="body2">{`Teacher: ${teacherName}` }</Typography>
                <Typography variant="body2">{observationType}</Typography>
            </CardContent>
            <CardActions>
            {
                (type === 'Saved Observation' || type === 'Observation') && (
                    <Button 
                    color="primary"
                    size="small"
                    component={Link}
                    to= {
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
    )
}

const addObservationsToCalendar = (calendar, observations, type) => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const blocks = { '1': 'B1', '2': 'B2', '3': 'B3', '4': 'B4', '5': 'B5' };
    
    for(let observation of observations){
        const {block, observationDate, teacher, observationType} = observation.observationDetails;
        const teacherName = `${teacher.firstName} ${teacher.lastName}`;
        let displayName = `Observation - ${teacherName}`;
        if(block === '') continue;
        const backgroundColor = type === 'Saved Observation' ? '#87b9ed' : '#9bbab0';
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

const getWeekRange = (selectedDate) => {
    const date = selectedDate.getDate();
    const day = selectedDate.getDay();
    const numOfMonday = date - day + ( day === 0 ? -6 : 1);
    const start = new Date(selectedDate);
    start.setDate(numOfMonday);
    start.setHours(0);
    const end = new Date(start);
    end.setDate(start.getDate() + 5);

    return [start, end];
};