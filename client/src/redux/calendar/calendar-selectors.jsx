import { createSelector } from 'reselect';

export const selectCalendarState = state => state.calendar;

export const selectShowGoogleCalendarEvents = createSelector(
    [selectCalendarState],
    calendar => calendar.showGoogleCalendarEvents
); 