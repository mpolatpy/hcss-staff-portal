
export const mapObservationData = (observationCount) => {
    const { teacher } = observationCount;
    const id = teacher.id;

    return {
        id: id,
        teacher: {
            id: id,
            name: `${teacher.lastName}, ${teacher.firstName}`
        },
        weeklyObservations: {
            count: observationCount['Weekly Observation'],
            id: id
        },
        fullClassObservation: {
            count: observationCount['Full Class Observation'],
            id: id
        },
        quarterEvaluation: {
            count: observationCount['Quarter Evaluation'],
            id: id
        },
        midyearEvalaution: {
            count: observationCount['Midyear Evaluation'],
            id: id
        },
        endOfYearEvaluation: {
            count: observationCount['End of Year Evaluation'],
            id: id
        }
    }
};



