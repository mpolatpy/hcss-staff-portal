import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { fetchSavedObservationsAsync } from '../../redux/saved-observations/saved-observations.actions';
import { selectShowGoogleCalendarEvents } from '../../redux/calendar/calendar-selectors';
import { createWeeklyCalendar } from './calendar-utils';
import CalendarMoreMenu from './calendar-more.component';
import SettingsCard from './calendar-settings';
import DatePicker from '../../components/date-picker/date-picker.component';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(1),
        '& .MuiTableCell-head': {
            // backgroundColor: '#3f51b5',
            // color: '#fff',
            padding: theme.spacing(1)
        },
        '& .MuiTableCell-root': {
            border: "1px solid",
            borderColor: "#d3d3d3",
            // padding: theme.spacing(1)
        },
    },
    margin: {
        marginLeft: theme.spacing(1),
    },
    tableContainer: {
        marginTop: theme.spacing(2),
        width: '100%'
    },
    blocks: {
        width: '5%',
    },
    monthContainer: {
        marginBottom: '15px'
    },
    mainColumns: {
        width: '18vw',
        padding: '2px',
        overflow: 'hidden'
    },
    actionsContainer: {
        display: 'flex',
        direction: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
}));

const CalendarPage = ({ currentYear, currentUser, history, match, fetchSavedObservations, showGoogleCalendarEvents }) => {
    const monthNames = [
        "January", "Februay", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const blocks = ['B1', 'B2', 'B3', 'B4', 'B5', 'SH', 'After School'];
    const classes = useStyles();
    const [monday, setMonday] = useState(null);
    const [calendar, setCalendar] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.id) {
            fetchCalendar(currentYear, currentUser, showGoogleCalendarEvents);
            fetchSavedObservations(currentUser, currentYear);
        }

    }, [currentYear, currentUser]);

    const fetchCalendar = async (currentYear, currentUser, showGoogleCalendarEvents, selectedDate = null) => {
        setLoading(true);
        if (!selectedDate) selectedDate = getMonday();
        setMonday(selectedDate);
        const calendar = await createWeeklyCalendar(selectedDate, currentYear, currentUser, showGoogleCalendarEvents);
        setCalendar(calendar);
        setLoading(false);
    }

    const getMonday = () => {
        const d = new Date();
        const date = d.getDate();
        const day = d.getDay();
        const numOfMonday = date - day + (day === 0 ? -6 : 1);
        d.setDate(numOfMonday);
        return d;
    };

    const getDayNums = () => {
        if (!monday) return;

        let i = 1, current = new Date(monday);
        const dayNums = [];
        while (i <= 5) {
            let currentNum = current.getDate();
            dayNums.push(currentNum);
            current.setDate(current.getDate() + 1);
            i++;
        }
        return dayNums;
    }

    const dayNums = getDayNums() || [];
    const year = monday ? monday.getFullYear() : '';
    const month = monday ? monthNames[monday.getMonth()] : '';

    const handleNext = (val) => {
        const selectedDate = new Date(monday);
        selectedDate.setDate(selectedDate.getDate() + val);
        fetchCalendar(currentYear, currentUser, showGoogleCalendarEvents, selectedDate);
    }

    const handleDateChange = (d) => {
        const date = d.getDate();
        const day = d.getDay();
        const numOfMonday = date - day + (day === 0 ? -6 : 1);
        d.setDate(numOfMonday);
        fetchCalendar(currentYear, currentUser, d);
    }

    return (
        loading ? (
            <CircularProgress />
        ) : (
            <div className={classes.root}>
                <Grid container direction="row" alignItems="flex-end">
                    <Grid item container alignItems="center" xs={4} md={4} direction="row" style={{ padding: '5px' }}>
                        <Typography variant="h5">Calendar</Typography>
                        <span>
                            <Tooltip title="Previous Week">
                                <IconButton aria-label="previous-week" name="previous-week" onClick={() => handleNext(-7)} className={classes.margin}>
                                    <ArrowBackIosIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Next Week">
                                <IconButton aria-label="next-week" name="next-week" onClick={() => handleNext(7)}>
                                    <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </span>
                    </Grid>
                    <Grid item xs={3} md={4} className={classes.monthContainer}>
                        <Typography variant="h5">{`${month}, ${year}`}</Typography>
                    </Grid>
                    <Grid xs={5} md={4} item className={classes.actionsContainer} >
                        <span style={{ width: '180px', marginBottom: '15px' }}>
                            <DatePicker
                                handleDateChange={handleDateChange}
                                selectedDate={monday}
                                InputProps={{
                                    disableUnderline: true
                                }}
                                name="calendar_date"
                                label="Week of Monday"
                                margin="none"
                            />
                        </span>
                        <Tooltip title="Settings">
                            <SettingsCard 
                                fetchCalendar={fetchCalendar}
                                currentYear={currentYear} 
                                currentUser={currentUser}
                            />
                        </Tooltip>
                        <CalendarMoreMenu history={history} match={match} />
                        <Button size="small" variant="outlined" onClick={() => fetchCalendar(currentYear, currentUser, showGoogleCalendarEvents)}>This Week</Button>
                    </Grid>
                </Grid>
                <Divider />
                <TableContainer className={classes.tableContainer} component={Paper} elevation={0}>
                    <Table  >
                        <TableHead >
                            <TableRow >
                                <TableCell align="center">Blocks</TableCell>
                                {
                                    days.map((day, i) => (
                                        <TableCell align="center" key={`day-${i}`}>
                                            <Typography>{day}</Typography>
                                            <Typography variant="h5">{dayNums[i]}</Typography>
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                calendar && blocks.map(block => (
                                    <TableRow key={`block-${block}`}>
                                        <TableCell align="center" className={classes.blocks}>
                                            {block}
                                        </TableCell>
                                        {
                                            days.map((day, j) => (
                                                <TableCell className={classes.mainColumns} key={`block-${day}-${j}`}>
                                                    <>
                                                        {
                                                            calendar[block][day].map((item, k) => (
                                                                <div key={`${block}_${day}_${k}`}>
                                                                    {item}
                                                                </div>
                                                            ))
                                                        }
                                                    </>
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    showGoogleCalendarEvents: selectShowGoogleCalendarEvents
});

const mapDispatchToProps = dispatch => ({
    fetchSavedObservations: (user, year) => dispatch(fetchSavedObservationsAsync(user, year)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);