import { createSelector } from 'reselect';

export const selectTeachersState = state => state.teachers;

export const selectTeachers = createSelector( 
    [selectTeachersState], teachersState => teachersState.teachers
);

export const selectTeacherList = createSelector( 
    [selectTeachers], teachers => 
    teachers ? Object.keys(teachers).map(key => teachers[key]) : []
);

export const selectTeacher = teacherId => createSelector(
    [selectTeachers], teachers => teachers ? teachers[teacherId] : null
);

export const selectTeachersIsLoading = createSelector(
    [selectTeachersState], teachersState => teachersState.isLoading
);

export const selectIsTeachersLoaded = createSelector(
    [selectTeachers], teachers => !!teachers
);

export const selectTeacherOptions = createSelector( 
    [selectTeacherList], 
    teacherList => teacherList.filter(teacher => teacher.firstName !== null)
                              .map( teacher => `${teacher.lastName}, ${teacher.firstName}` )
)

export const selectTeachersObjWithNameKeys = createSelector(
    [selectTeachers], teachers => {
        const ids = Object.keys(teachers);
        const teachersObjWithNameKeys = {};

        ids.forEach( id => { 
            const teacher = teachers[id];
            const nameKey = `${teacher.lastName}, ${teacher.firstName}`;
            teachersObjWithNameKeys[nameKey] = teacher;
        });

        return teachersObjWithNameKeys;
    }
)
