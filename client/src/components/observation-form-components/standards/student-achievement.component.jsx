import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectObservationType, selectEvaluationScore } from '../../../redux/observation-form/observation-form.selectors'
import { setEvaluationScore } from '../../../redux/observation-form/observation-form.actions';
import { selectCurrentUser } from '../../../redux/user/user.selectors';
import StudentAchievementCard from './student-achievement.card';


const StudentAchievementComponent = ({ currentUser, observationType, previousObservations, evaluationScore, readOnly, setEvaluationScore }) => {

    if (!observationType.includes('Evaluation')) {
        return null;
    }

    const filteredObservations = previousObservations.filter(x => x.observationType === observationType);

    const handleStarChange = (e) => {
        const { name, value } = e.target;
        setEvaluationScore({
            ...evaluationScore,
            [name]: parseInt(value)
        });
    }

    return (
        <>

            <StudentAchievementCard
                title="Evaluation Score"
                evaluationScore={evaluationScore}
                readOnly={readOnly}
                handleStarChange={handleStarChange}
            />
            {
                currentUser && currentUser.role === 'superadmin' && filteredObservations.map((observation, i) => (
                    <StudentAchievementCard
                        key={`observation-card-${i}`}
                        title={`Observer: ${observation.observationDetails.observer.lastFirst}`}
                        evaluationScore={observation.evaluationScores}
                        observationNotes={observation.observationNotes}
                        readOnly={true}
                        handleStarChange={handleStarChange}
                    />

                ))
            }
        </>
    )

};

const mapStateToProps = createStructuredSelector({
    evaluationScore: selectEvaluationScore,
    observationType: selectObservationType,
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setEvaluationScore: score => dispatch(setEvaluationScore(score)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentAchievementComponent);