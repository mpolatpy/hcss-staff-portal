import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        maxWidth: 400,
    },
    media: {
        height: 140,
    },
});

const CustomCard = ({ imageUrl, title, children, to, buttonText, header, history }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={() => history.push(to)}>
                <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {header}
                    </Typography>
                    {children}
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" component={Link} to={to}>
                    {buttonText}
                </Button>
            </CardActions>
        </Card>
    );
}

export default withRouter(CustomCard);