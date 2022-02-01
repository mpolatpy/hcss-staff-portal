import { firestore } from '../../firebase/firebase.utils';

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
        domainTwo: domainTwoScore,
        domainThree: domainThreeScore,
        domainFour: domainFourScore,
    };
}

const getUpdatedObservationScore = (prevData, observation) => {
    const domains = ['domainOne', 'domainTwo', 'domainThree', 'domainFour'];
    const newScore = calculateObservationScore(observation);

    const prev = prevData.data();

    const updateDomainScore = (prev, newScore, domain) => {
        if (!newScore[domain]) {
            return prev[domain];
        }

        const newDomainScore = newScore[domain];
        let num = prev[domain].numScores;
        const score = (prev[domain].score * num + newDomainScore) / (num + 1);

        return ({
            numScores: num + 1,
            score: score
        });
    };

    const updatedScores = {}
    domains.forEach(domain => updatedScores[domain] = updateDomainScore(prev, newScore, domain));
    return updatedScores;
}

const getOrCreateScoreDocument = async (teacher, currentYear, observationType) => {
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
        } catch (e) {
            console.log('error creating score document', e.message);
        }
    }

    return scoreRef;
}

const getOrCreateObservationCountsDocRef = async (observerId, teacher, currentYear) => {
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
        } catch (e) {
            console.log('error creating observationCount document', e.message);
        }
    }

    return ref;
}

const getUpdatedObservationCount = (prevObservationCount, observationType) => {

    const prevData = prevObservationCount.data();
    const count = prevData[observationType] + 1;

    return {
        ...prevData,
        [observationType]: count
    }
};

export const submitInitialObservation = async (observationFormData, newObservationRef, observationForm, observerId) => {
    const { observationDetails } = observationFormData;
    const { observationDate, observationType, teacher, observer } = observationDetails;
    const schoolYear = observationDetails.schoolYear;
    const isEvaluation = observationType.includes('Evaluation');
    const scoreRef = await getOrCreateScoreDocument(teacher, schoolYear, observationType);
    const prev = await scoreRef.get();
    const updatedScore = getUpdatedObservationScore(prev, observationFormData);
    const observationCountRef = await getOrCreateObservationCountsDocRef(observerId, teacher, schoolYear);
    const prevObservationCount = await observationCountRef.get();
    const updatedObservationCount = getUpdatedObservationCount(prevObservationCount, observationType);
    const notificationRef = firestore.collection(`notifications`).doc(schoolYear).collection(teacher.id).doc();
    const emailRef = firestore.collection("emails").doc();

    return await firestore.runTransaction(async (transaction) => {
        transaction.set(newObservationRef, observationForm);

        if (observationFormData.isSavedObservation) {
            const prevRef = firestore.collection('savedObservations').doc(observationFormData.firestoreRef.id);
            transaction.delete(prevRef);
        }

        transaction.set(observationCountRef, updatedObservationCount);
        transaction.update(scoreRef, updatedScore);

        if (!isEvaluation || (isEvaluation && observer.role === 'superadmin')) {

            transaction.set(notificationRef, {
                message: 'You have a new observation',
                display: true,
                date: observationForm.submittedAt,
                viewLink: `/observations/submitted/observation/${newObservationRef.id}`
            });

            transaction.set(emailRef, ({
                to: teacher.email,
                message: {
                    subject: `Notification - New Observation Feedback`,
                    text: `Hi ${teacher.firstName},
    
    This is an automated observation notificication.
    
    Observation Type: ${observationType}
    Observer: ${observationDetails.observer.lastName} ${observationDetails.observer.firstName}
    Date: ${observationDate.toLocaleDateString("en-US")}
    
    Please view the details and the feedback in HCSS Staff Portal.
    
    https://staffportal.hampdencharter.org
    
    Thank you
    
    `,
                    // html: "This is the <code>HTML</code> section of the email body.",
                },
            }));
        }
    });

};

export const submitEditedObservation = async (observationForm, previousScore, firestoreRef) => {
    const { observationDetails, observationScore } = observationForm;
    const { observationType, teacher } = observationDetails;
    const schoolYear = observationDetails.schoolYear;
    const scoreRef = await getOrCreateScoreDocument(teacher, schoolYear, observationType);
    const previousAverageSnapshot = await scoreRef.get();
    const previousAverage = previousAverageSnapshot.data();
    const updatedAveScore = getUpdatedAverageForEditedObservation(previousAverage, previousScore, observationScore);

    return await firestore.runTransaction(async (transaction) => {
        transaction.update(firestoreRef, observationForm);
        transaction.update(scoreRef, updatedAveScore);
    });
}

const getUpdatedAverageForEditedObservation = (previousAverage, previousScore, observationScore) => {
    const domains = ['domainOne', 'domainTwo', 'domainThree', 'domainFour'];

    const updateDomainScore = (previousAverage, previousScore, observationScore, domain) => {

        const newDomainScore = observationScore[domain];
        const previousDomainScore = previousScore[domain];
        const num = previousAverage[domain].numScores;
        const previousDomainAve = previousAverage[domain].score
        let updatedNum, updatedScore;


        if (newDomainScore && previousDomainScore) {
            updatedNum = num;
            const difference = newDomainScore - previousDomainScore;
            updatedScore = (previousDomainAve * num + difference) / (num);
        } else if (!newDomainScore && previousDomainScore) {
            updatedNum = num - 1;
            updatedScore = (previousDomainAve * num - previousDomainScore) / (num - 1);
        } else if (newDomainScore && !previousDomainScore) {
            updatedNum = num + 1;
            updatedScore = (previousDomainAve * num + newDomainScore) / (num + 1);
        } else {
            updatedNum = num;
            updatedScore = previousDomainAve;
        }

        return ({
            numScores: updatedNum,
            score: updatedScore
        });
    };

    const updatedScores = {}
    domains.forEach(domain => updatedScores[domain] = updateDomainScore(previousAverage, previousScore, observationScore, domain));
    return updatedScores;
}