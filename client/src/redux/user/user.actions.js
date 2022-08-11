import { UserActionTypes } from './user.types';

export const setCurrentUser = user => ({
    type: UserActionTypes.SET_CURRENT_USER,
    payload: user
});

export const setSchoolPreference = school => ({
    type: UserActionTypes.SET_SCHOOL_PREFERENCE,
    payload: school
});

export const setDepartmentPreference = department => ({
    type: UserActionTypes.SET_DEPARTMENT_PREFERENCE,
    payload: department
});

export const setActiveTeacherPreference = choice => ({
    type: UserActionTypes.SET_ACTIVE_TEACHER_PREFERENCE,
    payload: choice
});
