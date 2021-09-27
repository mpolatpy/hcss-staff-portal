import { Route } from 'react-router-dom';
import CalendarPage from './calendar.page';
import MeetingForm from './meeting.page';
import AuthorizeGoogleCalendar from './authorize-google-calendar';

const Calendar = (props) => {
    const { match } = props;

    return ( 
        <div>
            <Route exact path={match.path} render={(props) => <CalendarPage {...props} />} />
            <Route path={`${match.path}/create-meeting`} component={MeetingForm} />
            <Route path={`${match.path}/authorize`} component={AuthorizeGoogleCalendar} />
            <Route path={`${match.path}/meeting/:meetingId`} component={MeetingForm} />
        </div>
    );
}

export default Calendar;