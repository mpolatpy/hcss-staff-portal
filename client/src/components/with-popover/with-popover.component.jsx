import React from 'react';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const WithMouseOverPopover = (WrappedComponent) => {
    const ComponentWithPopover = ({id, popoverContent, ...props}) => {
        const classes = useStyles();
        const [anchorEl, setAnchorEl] = React.useState(null);

        const handlePopoverOpen = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handlePopoverClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);

        return (
            <div>
                <div aria-owns={open ? "id" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}>
                    <WrappedComponent
                        {...props}
                    />
                </div>
            <Popover
                id="id"
                className={classes.popover}
                classes={{
                paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>I use Popover.</Typography>
                {/* {popoverContent} */}
            </Popover>
            </div>
        );
    }

    return ComponentWithPopover;
}

export default WithMouseOverPopover;