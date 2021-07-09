import {firestore} from '../../firebase/firebase.utils';

const calculateDomainAverage = (domain) => {
    let total = 0;
    let count = 0;
    const values = Object.values(domain);
    values.forEach(value => {
        if (value !== 0) {
            total += value;
            count++;
        }
    });
     
    return (count ? (total / count) : null);
}

export const calculateObservationScore = (observation) => {
    const { domainOne, domainTwo, domainThree, domainFour } = observation;
    const domainOneScore = calculateDomainAverage(domainOne);
    const domainTwoScore = calculateDomainAverage(domainTwo);
    const domainThreeScore = calculateDomainAverage(domainThree);
    const domainFourScore = calculateDomainAverage(domainFour);
    
    return {
        domainOne: domainOneScore, 
        domainTwo:  domainTwoScore,
        domainThree: domainThreeScore, 
        domainFour: domainFourScore,
    };
}

export const getUpdatedObservationScore = (prevData, observation) => {
    const domains = [ 'domainOne', 'domainTwo', 'domainThree', 'domainFour' ];
    const newScore = calculateObservationScore(observation);

    const prev = prevData.data();

    const updateDomainScore = (prev, newScore, domain) => {
        if(!newScore[domain]) {
            return prev[domain];
        } 

        const newDomainScore = newScore[domain];
        let num = prev[domain].numScores;
        const score = (prev[domain].score * num + newDomainScore)/(num+1);

        return ({
            numScores: num+1,
            score: score
        });
    };

    const updatedScores = {}
    domains.forEach( domain => updatedScores[domain] = updateDomainScore(prev, newScore, domain));
    return updatedScores;
}

export const getOrCreateScoreDocument = async (teacher, currentYear, observationType) => {
    const teacherId = teacher.id;
    const observationTypeMap = {
        'Weekly Observation': 'weeklyObservationScores',
        'Full Class Observation': 'fullClassObservationScores',
        'Quarter Evaluation': 'quarterScores',
        'Midyear Evaluation': 'midyearScores',
        'End of Year Evaluation': 'endOfYearScores'
    };


    const collectionType = observationTypeMap[observationType];
    const scoreRef = firestore.doc(`observationScores/${currentYear}/${collectionType}/${teacherId}`);
    const snapShot = await scoreRef.get();

    if (!snapShot.exists) {
        try {
            await scoreRef.set({
                    teacher: teacher,
                    domainOne: {
                        score: 0,
                        numScores: 0
                    },
                    domainTwo: {
                        score: 0,
                        numScores: 0
                    },
                    domainThree: {
                        score: 0,
                        numScores: 0
                    },
                    domainFour: {
                        score: 0,
                        numScores: 0
                    },
                })
        } catch(e) {
            console.log('error creating score document', e.message);
        }
    }

    return scoreRef;
}

export const getOrCreateObservationCountsDocRef = async (observerId, teacher, currentYear) => {
    const teacherId = teacher.id;
    const ref = firestore.doc(`observationCounts/${currentYear}/${observerId}/${teacherId}`);
    const snapShot = await ref.get();

    if (!snapShot.exists) {
        try {
            await ref.set({
                teacher: teacher,
                'Weekly Observation': 0,
                'Full Class Observation': 0,
                'Quarter Evaluation': 0,
                'Midyear Evaluation': 0,
                'End of Year Evaluation': 0,
            });
        } catch(e) {
            console.log('error creating observationCount document', e.message);
        }
    }

    return ref;
}

export const getUpdatedObservationCount = (prevObservationCount, observationType) => {
    
    const prevData = prevObservationCount.data();
    const count = prevData[observationType] + 1;

    return {
        ...prevData,
        [observationType]: count
    }
}