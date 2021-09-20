import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '2px',
        minWidth: '20vw',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: theme.spacing(1),
        minHeight: '80px',
        backgroundColor: theme.palette.background.paper,
    }, 
    linkContainer: {
        padding: '2px 3px 2px 3px',
        textDecoration: 'none',
        marginBottom: '2px',
        width: '16vw'
    }
}));

const CustomPopper = ({ children, displayName, backgroundColor }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    // const handleClickAway = () => {
    //     setAnchorEl();
    // };

    const open = Boolean(anchorEl);
    const id = open ? 'open-popper' : undefined;

    return (
        <div>
            {/* <ClickAwayListener onClickAway={handleClickAway}> */}
                <Link
                    aria-describedby={id}
                    onClick={handleClick}
                    component="button"
                    variant="caption"
                    underline="none"
                    noWrap
                >
                    <Paper 
                    style={open ? { backgroundColor: '#d3d3d3' } : {backgroundColor: backgroundColor}}
                    className={classes.linkContainer} 
                    variant="outlined" 
                    >
                        <strong>{displayName}</strong>
                    </Paper>
                </Link>
                <Popper id={id} open={open} anchorEl={anchorEl}>
                    {children}
                    {/* <div className={classes.paper}>{children}</div> */}
                </Popper>
            {/* </ClickAwayListener> */}
        </div>
    );
};

export default CustomPopper;
