import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectShowGoogleCalendarEvents } from '../../redux/calendar/calendar-selectors';
import { updateShowGoogleCandarEvents } from '../../redux/calendar/calendar-actions';
import Popper from '@material-ui/core/Popper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './calendar-utils';

const SettingsCard = ({ fetchCalendar, currentYear, currentUser, showGoogleCalendarEvents, updateShowGoogleCandarEvents }) => {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'open-popper' : undefined;

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handlePreference = () => {
        updateShowGoogleCandarEvents(!showGoogleCalendarEvents);
        fetchCalendar(currentYear, currentUser, !showGoogleCalendarEvents);
    }

    return (
        <>
            <IconButton
                onClick={handleClick}
                aria-label="calendar-settings"
                className={classes.margin}
            >
                <SettingsIcon fontSize="small" />
            </IconButton>
            <Popper id={id} open={open} anchorEl={anchorEl}>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Calendar Settings
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showGoogleCalendarEvents}
                                    onChange={handlePreference}
                                    name="notifyGuests"
                                    color="primary"
                                />
                            }
                            label="Show Common Events with Google Calendar"
                        />
                    </CardActions>
                </Card>
            </Popper>
        </>
    );
}

const mapStateToProps = createStructuredSelector({
    showGoogleCalendarEvents: selectShowGoogleCalendarEvents
});

const mapDispatchToProps = dispatch => ({
    updateShowGoogleCandarEvents: (selection) => dispatch(updateShowGoogleCandarEvents(selection))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCard);