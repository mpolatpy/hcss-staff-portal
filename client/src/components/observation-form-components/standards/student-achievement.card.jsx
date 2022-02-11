import React from 'react';
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

const StudentAchievementCard = ({ evaluationScore, title, readOnly, handleStarChange, observationNotes }) => {
    const classes = useStyles();

    return (
        <Paper className={classes.root} variant='outlined'>
            <Typography><strong>{title}</strong></Typography>
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
            {
                observationNotes && (
                    <Typography className={classes.ratingContainer}>{observationNotes}</Typography>
                )
            }
        </Paper>
    )

};

export default StudentAchievementCard;