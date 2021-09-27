import { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';

const CalendarMoreMenu = ({match, history}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAuthorization = async () => {
        const resp = await axios.post('/generate-auth-url');
        if(resp.status !== 200) {
            alert('Your request could not be completed this time, please contact site administrator.');
            return;
        }
        const url = resp.data;
        window.location.assign(url);
    }

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
            <MenuItem onClick={handleAuthorization}>
                Authorize Google Calendar
            </MenuItem>
            </Menu>
        </div>
    );
};

export default CalendarMoreMenu;