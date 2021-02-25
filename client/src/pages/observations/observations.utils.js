
export function mapObservationData(observation, index){
    const observationDetails = observation.observationDetails;
    const domainOne = observation.domainOne;
    const domainTwo = observation.domainTwo;
    const domainThree = observation.domainThree;
    const domainFour = observation.domainFour;

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
    {field: 'teacher', headerName: 'Teacher', width: 130},
    { field: 'observationDate', headerName: 'Date', width: 110 },
    { field: 'block', headerName: 'Block', width: 100},
    { field: 'observationType', headerName: 'Observation Type', width: 150 },
    { field: 'school', headerName: 'School', width: 110 },
    { field: 'department', headerName: 'Department', width: 130 },
    { field: 'course', headerName: 'Course', width: 130 },
    { field: 'partOfTheClass', headerName: 'Part of the Class', width: 130 },
    { field: 'observationNotes', headerName: 'Notes', width: 250 },
];