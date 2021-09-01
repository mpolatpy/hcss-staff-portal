export const calculateAverageScores = (type, value, courseId, lessonPlanScores) => {
    const previousScore = lessonPlanScores.average[type];
    let numScores, rate;
    let previousCourseScore = lessonPlanScores.courses[courseId][type];

    if( value !== ''){
        if (previousCourseScore !== ''){
            numScores = previousScore.numScores;            
            rate = (numScores*previousScore.rate - previousCourseScore + parseInt(value)) / numScores;
        } else {
            numScores = previousScore.numScores + 1;
            rate = (previousScore.rate * previousScore.numScores + parseInt(value)) / numScores;
        }
    } else {
        const filteredCourses = Object.values(lessonPlanScores.courses).filter(
            item => (item.percentSubmitted && lessonPlanScores.courses[courseId].id !== item.id)
        );

        let total = 0;
        numScores = 0;

        for( let course of filteredCourses ){
            total += parseInt(course.percentSubmitted);
            numScores++;
        }

        rate = (total!==0 && numScores!==0) ? total/numScores : 0;
    }
    
    return {
        rate,
        numScores
    }
};

export const calculateUpdatedLPScore = (newScore, previousScore, lessonPlanAveScore) => {

    const updatedOnTimeScore = getUpdatedRateForDomain(newScore, previousScore, lessonPlanAveScore, 'onTime');
    const updatedPercentSubmittedScore = getUpdatedRateForDomain(newScore, previousScore, lessonPlanAveScore, 'percentSubmitted')

    return {
        ...lessonPlanAveScore,
        onTime: {
            ...lessonPlanAveScore.onTime,
            rate: updatedOnTimeScore
        },
        percentSubmitted: {
            ...lessonPlanAveScore.percentSubmitted,
            rate: updatedPercentSubmittedScore
        }
    };
    
}

const getUpdatedRateForDomain = (newScore, previousScore, lessonPlanAveScore, domain) => {
    const difference = newScore[domain].rate - previousScore[domain].rate;
    const {rate, numScores} = lessonPlanAveScore[domain];

    const updatedRate = (rate * numScores + difference)/numScores;
    return updatedRate;
}