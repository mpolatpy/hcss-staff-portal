import { createSelector } from "reselect";

const selectYear = state => state.schoolYear;

export const selectCurrentYear = createSelector(
    [selectYear],
    year => year.currentYear,
);