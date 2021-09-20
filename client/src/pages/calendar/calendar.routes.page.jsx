import { Route } from 'react-router-dom';
import CalendarPage from './calendar.page';
import MeetingForm from './new-meeting.page';

const Calendar = (props) => {
    const { match } = props;

    return ( 
        <div>
            <Route exact path={match.path} render={(props) => <CalendarPage {...props} />} />
            <Route path={`${match.path}/create-meeting`} component={MeetingForm} />
        </div>
    );
}

export default Calendar;