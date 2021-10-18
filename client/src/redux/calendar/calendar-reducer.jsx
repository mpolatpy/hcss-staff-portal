import CalendarActionTypes from "./calendar-types";

const INITIAL_STATE = {
    showGoogleCalendarEvents: false
};

const calendarReducer = (state=INITIAL_STATE, action) => {
    switch (action.type){
        case CalendarActionTypes.UPDATE_SHOW_GOOGLE_CALENDAR_EVENTS:
            return {
                showGoogleCalendarEvents: action.payload
            };
        default:
            return state;
    }
};

export default calendarReducer;