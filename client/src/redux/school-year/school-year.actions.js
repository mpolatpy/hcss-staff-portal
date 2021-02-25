import { SchoolYearActionTypes } from './school-year.types';

export const setCurrentYear = year => ({
    type: SchoolYearActionTypes.SET_CURRENT_YEAR,
    payload: year
});