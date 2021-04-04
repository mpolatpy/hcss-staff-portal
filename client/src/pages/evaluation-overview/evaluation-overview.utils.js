import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';

export const observationTypeMap = {
    'Weekly Observation': 'weeklyObservationScores',
    'Full Class Observation': 'fullClassObservationScores',
    'Quarter Evaluation': 'quarterScores',
    'Midyear Evaluation': 'midyearScores',
    'End of Year Evaluation': 'endOfYearScores'
};

export const convertScoreToRating = (score) => {
    if (score === 0) return 'NA';
    else if (score >= 3.5) return 'Exceeding';
    else if (score >= 2.5) return 'Meeting';
    else if (score >= 1.5) return 'Partially Meeting';
    else return 'Not Meeting';
};

export const applyStyles = (params) => clsx('rating-cell', {
    "exceeding": params.value >= 3.5,
    "meeting": params.value >= 2.5 && params.value < 3.5,
    "partially": params.value >= 1.5 && params.value < 2.5,
    "notMeeting": params.value < 1.5 && params.value !== 0,
});

export const createRows = (observationScores) => observationScores.map( 
    observation => ({
        id: observation.teacher.id,
        name: `${observation.teacher.lastName}, ${observation.teacher.firstName}`,
        department: observation.teacher.department,
        school: observation.teacher.school,
        domainOne: observation.domainOne.score,
        domainTwo: observation.domainTwo.score,
        domainThree: observation.domainThree.score,
        domainFour: observation.domainFour.score
    })
);

export const Render_Rating = (params, isShowingNumbers) => (
    <div>
        {
            isShowingNumbers?
            <p>{params.value.toFixed(2)}</p>:
            convertScoreToRating(params.value) !== 'NA' ?
            (
                <>
                    <Typography variant="body2">{convertScoreToRating(params.value)}</Typography> 
                    <Typography variant="body2">Expectations</Typography>
                </>
            ):(
                <>
                    <Typography variant="body2">{convertScoreToRating(params.value)}</Typography> 
                </>
            )
        }
    </div>
);

export const RenderRating = ( params, isShowingNumbers ) => ( 
    <>
        {
            isShowingNumbers ? 
            <p>{(params.value.toFixed(2))}</p>:
            <Rating
                value={Math.ceil(params.value)}
                readOnly
                max={4}
                precision={0.25}
            />
        }
    </>
)