import { createSelector } from "reselect";

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
    [selectUser],
    user => user.currentUser
);

export const selectSchoolPreference = createSelector(
    [selectUser],
    user => user.schoolPreference
);

export const selectDepartmentPreference = createSelector(
    [selectUser],
    user => user.departmentPreference
);