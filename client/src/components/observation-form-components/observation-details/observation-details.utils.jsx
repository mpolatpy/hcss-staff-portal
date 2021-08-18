
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