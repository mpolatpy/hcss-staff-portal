import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StarRating from '../star-rating/star-rating.component';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    ratingContainer: {
        marginBottom: theme.spacing(1)
    }
}));

const EvaluationCard = ({evaluation, type}) => {
    const classes = useStyles();
    const readOnly = true;
    const {id, evaluationScores: evaluationScore} = evaluation;

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.ratingContainer} variant="h5">{type}</Typography>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Overall Score</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="overallScore"
                        size="small"
                        value={evaluationScore.overallScore}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain I</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainOneScore"
                        size="small"
                        value={evaluationScore.domainOneScore}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain II</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainTwoScore"
                        size="small"
                        value={evaluationScore.domainTwoScore}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain III</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainThreeScore"
                        size="small"
                        value={evaluationScore.domainThreeScore}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Domain IV</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="domainFourScore"
                        size="small"
                        value={evaluationScore.domainFourScore}
                    />
                </div>
                <div className={classes.ratingContainer}>
                    <Typography variant="subtitle1">Student Achievement</Typography>
                    <StarRating
                        readOnly={readOnly}
                        name="studentAchievement"
                        size="small"
                        value={evaluationScore.studentAchievement}
                    />
                </div>
            </CardContent>
            <CardActions>
                <Button color="primary" component={Link} to={`/observations/submitted/observation/${id}`}>View Details</Button>
            </CardActions>
        </Card>
    )
};

export default EvaluationCard;