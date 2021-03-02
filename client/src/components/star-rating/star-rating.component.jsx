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

export default function StarRating({ name, value, handleStarChange, precision, hideRating, size, readOnly}) {
    const [hover, setHover] = React.useState(-1);
    const classes = useStyles();
    const precisionValue = precision ? precision : 1;
    const starSize = size ? size: 'large';
    return (
        <div className={classes.root}>
            <Rating
                readOnly={readOnly}
                size={starSize}
                name={name}
                value={value}
                precision={precisionValue}
                max={4}
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                onChange={handleStarChange}
                onChangeActive={(event, newHover) => {
                    setHover(newHover);
                }}
            />
            {
                hideRating ?
                null:
                <div className={classes.hoverRating}>
                    {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
                </div>
            }
        </div>
    );
}
