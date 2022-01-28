import { firestore } from '../../../firebase/firebase.utils';

export const getObservationOptions = (currentUser) => {

    // if (currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'teacher')){
    //     return [
    //         'Weekly Observation',
    //         'Full Class Observation',
    //         'Quarter Evaluation',
    //         'Midyear Evaluation',
    //         'End of Year Evaluation'
    //     ];
    // }

    // return [
    //     'Weekly Observation',
    //     'Full Class Observation',
    //     'Evaluation - Quarter',
    //     'Evaluation - Midyear',
    //     'Evaluation - End of Year'
    // ]

    return [
        'Weekly Observation',
        'Full Class Observation',
        'Quarter Evaluation',
        'Midyear Evaluation',
        'End of Year Evaluation'
    ];

};

export const sectionOptions = [
    '', '6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D',
    '9A', '9B', '9C', '9D', '10A', '10B', '10C', '10D', '11A', '11B', '11C', '11D',
    '12A', '12B', '12C', '12D'
];


export const fetchPreviousObservations = async (selectedTeacher, setPreviousObservations, currentYear) => {

    if(!selectedTeacher) return;

    const observationsRef = firestore.collection('observations')
        .where('teacherid', '==', selectedTeacher.id)
        .where('observationDetails.schoolYear', '==', currentYear)
        .orderBy('observationDate', 'desc');

    const snapshot = await observationsRef.get();
    const observations = snapshot.docs.map(doc => doc.data());
    
    setPreviousObservations(observations);
};