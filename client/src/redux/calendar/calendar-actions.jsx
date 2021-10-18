import CalendarActionTypes from "./calendar-types";

export const updateShowGoogleCandarEvents = (updatedSelection) => ({
    type: CalendarActionTypes.UPDATE_SHOW_GOOGLE_CALENDAR_EVENTS,
    payload: updatedSelection
});