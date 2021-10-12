import { createSelector } from 'reselect';

export const selectTeachersState = state => state.teachers; 

const selectUser = state => state.user;

export const selectSchoolPreference = createSelector(
    [selectUser],
    user => user.schoolPreference
); 

export const selectDepartmentPreference = createSelector(
    [selectUser],
    user => user.departmentPreference
);

export const selectTeachers = createSelector( 
    [selectTeachersState], teachersState => teachersState.teachers
);

export const selectTeacherList = createSelector( 
    [selectTeachers], teachers => teachers ? (
    Object.keys(teachers)
        .map(key => teachers[key])
        .sort( (t1, t2) => {
            const lastName1 = t1.lastName.toLowerCase();
            const lastName2 = t2.lastName.toLowerCase();
            if( lastName1 < lastName2 ){
                return -1;
            } 
            if( lastName1 > lastName2 ){
                return 1;
            } 
            return 0;
        } )
    ) : []
);

export const selectFilteredTeacherList = createSelector(
    [selectTeacherList, selectSchoolPreference, selectDepartmentPreference],
    (teachers, school, department) => {
        if(school && department){
            return teachers.filter( teacher => teacher.school === school && teacher.department === department );
        } else if(school){
            return teachers.filter( teacher => teacher.school === school);
        } else if(department){
            return teachers.filter( teacher => teacher.department === department);
        } else {
            return teachers;
        }
    }
)

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
    [selectFilteredTeacherList], 
    teacherList => teacherList.filter(teacher => teacher.firstName && teacher.role !== 'superadmin' && teacher.isActive )
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
