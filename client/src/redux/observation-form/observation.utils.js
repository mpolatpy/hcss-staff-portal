import firestore from '../../firebase/firebase.utils';

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

const calculateObservationScore = (observation) => {
    const { domainOne, domainTwo, domainThree, domainFour } = observation;

    return {
        domainOne: calculateDomainAverage(domainOne), 
        domainTwo: calculateDomainAverage(domainTwo), 
        domainThree: calculateDomainAverage(domainThree), 
        domainFour: calculateDomainAverage(domainFour)
    };
}

let updateObservationScore = (prev, newScore) => {
    const domains = [ 'domainOne', 'domainTwo', 'domainThree', 'domainFour' ];

    const updateDomainScore = (domain) => {
        if(!newScore[domain]) {
            return prev[domain];
        } 

        const newDomainScore = newScore[domain];
        let num = prev[domain].numScores;
        const score = (prev[domain].score * num + newDomainScore)/(num+1);

        return ({
            numOfObservations: num+1,
            score: score
        });
    };

    const updatedScores = {}
    domains.forEach( domain => updatedScores[domain] = updateDomainScore(domain));
    return updatedScores;
}

export const createScoreDocument = async (teacherId, observationType) => {

    const scoreRef = firestore.doc(`observationScores/${teacherId}/${observationType}/${teacherId}`);
    const snapShot = await scoreRef.get();

    if (!snapShot.exists) {
        try {
            await scoreRef.set({
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

// const observationScore = calculateObservationScore(observation);
// const { observationDetails } = observation;
// const teacherId = observationDetails.teacher.id;
// const observerId = observationDetails.observer.id;
// const { observationType } = observationDetails
