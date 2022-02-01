import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectObservationType, selectEvaluationScore } from '../../../redux/observation-form/observation-form.selectors'
import { setEvaluationScore } from '../../../redux/observation-form/observation-form.actions';
import StarRating from '../../star-rating/star-rating.component';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        marginTop: theme.spacing(2)
    },
    ratingContainer: {
        marginBottom: theme.spacing(2)
    }
}));

const StudentAchievementComponent = ({ observationType, evaluationScore, readOnly, setEvaluationScore }) => {
    const classes = useStyles();

    if (!observationType.includes('Evaluation')) {
        return null;
    }

    const handleStarChange = (e) => {
        const { name, value } = e.target;
        setEvaluationScore({
            ...evaluationScore,
            [name]: parseInt(value)
        });
    }

    return (
        <>
            <Typography variant="h5">Evalution Score</Typography>
            <Paper className={classes.root} variant='outlined'>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Overall Score</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="overallScore"
                        value={evaluationScore.overallScore}
                        handleStarChange={handleStarChange}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain I</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainOneScore"
                        value={evaluationScore.domainOneScore}
                        handleStarChange={handleStarChange}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain II</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainTwoScore"
                        value={evaluationScore.domainTwoScore}
                        handleStarChange={handleStarChange}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain III</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainThreeScore"
                        value={evaluationScore.domainThreeScore}
                        handleStarChange={handleStarChange}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain IV</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainFourScore"
                        value={evaluationScore.domainFourScore}
                        handleStarChange={handleStarChange}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Student Achievement</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="studentAchievement"
                        value={evaluationScore.studentAchievement}
                        handleStarChange={handleStarChange}
                    />
                </div>
            </Paper>
        </>
    )

};

const mapStateToProps = createStructuredSelector({
    evaluationScore: selectEvaluationScore,
    observationType: selectObservationType
});

const mapDispatchToProps = dispatch => ({
    setEvaluationScore: score => dispatch(setEvaluationScore(score)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentAchievementComponent);