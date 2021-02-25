import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const labels = {
    0: 'Not Applicable', 
    1: 'Not Meeting Expectations',
    2: 'Partially Meeting Expectations',
    3: 'Meeting Expectations',
    4: 'Exceeding Expectations',
};

const useStyles = makeStyles({
    root: {
        width: 200,
        display: 'flex',
        alignItems: 'center',
    },
    hoverRating: {
        flexGrow: 4
    }
});

export default function StarRating({ name, value, handleStarChange, readOnly}) {
    const [hover, setHover] = React.useState(-1);
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Rating
                readOnly={readOnly}
                size="large"
                name={name}
                value={value}
                precision={1}
                max={4}
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                onChange={handleStarChange}
                onChangeActive={(event, newHover) => {
                    setHover(newHover);
                }}
            />
            <div className={classes.hoverRating}>
                {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
            </div>
        </div>
    );
}
