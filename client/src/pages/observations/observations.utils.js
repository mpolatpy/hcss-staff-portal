
export function mapObservationData(observation, index){
    const observationDetails = observation.observationDetails;
    // const domainOne = observation.domainOne;
    // const domainTwo = observation.domainTwo;
    // const domainThree = observation.domainThree;
    // const domainFour = observation.domainFour;

    return {
        id: index,
        teacher: `${observationDetails.teacher.lastName} ${observationDetails.teacher.firstName}`,
        observationDate: new Date(observationDetails.observationDate.seconds * 1000).toLocaleDateString("en-US"),
        block: observationDetails.block,
        observationType: observationDetails.observationType,
        schoolYear: observationDetails.schoolYear,
        school: observationDetails.school,
        department: observationDetails.department,
        course: observationDetails.course,
        partOfTheClass: observationDetails.partOfTheClass,
        observationNotes: observation.observationNotes
    };
};

export const observationColumns = [
    {field: 'teacher', headerName: 'Teacher', headerClassName: 'teacher-list-header',flex: 1.5},
    { field: 'observationDate', headerName: 'Date', headerClassName: 'teacher-list-header', flex: 1 },
    { field: 'block', headerName: 'Block', headerClassName: 'teacher-list-header', flex: 0.8},
    { field: 'observationType', headerName: 'Observation Type', headerClassName: 'teacher-list-header', flex: 1.5 },
    { field: 'school', headerName: 'School', headerClassName: 'teacher-list-header', flex: 1 },
    { field: 'department', headerName: 'Department', headerClassName: 'teacher-list-header', flex: 1 },
    { field: 'course', headerName: 'Course', headerClassName: 'teacher-list-header',flex: 1.5 },
    { field: 'partOfTheClass', headerName: 'Part of the Class', headerClassName: 'teacher-list-header',flex: 1.2 },
];