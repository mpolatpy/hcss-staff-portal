import { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

const CalendarMoreMenu = ({match, history}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="calendar-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                id="calendar-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                // PaperProps={{
                //     style: {
                //         maxHeight: ITEM_HEIGHT * 4.5,
                //         width: '20ch',
                //     },
                // }}
            >  
            <MenuItem onClick={() => history.push(`${match.path}/create-meeting`)}>
                New Meeting
            </MenuItem>
            <MenuItem onClick={() => history.push('/observations/new')}>
                New Observation
            </MenuItem>
            </Menu>
        </div>
    );
};

export default CalendarMoreMenu;