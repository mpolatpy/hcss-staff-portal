import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { makeStyles } from "@material-ui/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
    root: {
        minWidth: '400px',

        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        }
    },
}));

const NotificationsPage = ({ currentYear, currentUser}) => {
    const classes = useStyles();
    const [notifications, setNotifications] = useState([]);
    const [query, setQuery ] = useState({});
    const QUERY_LIMIT = 10;

    useEffect( () =>{
        const fetchNotifications = async () => {
            const notificationsRef = firestore.collection(`notifications/${currentYear}/${currentUser.id}`)
                                                .orderBy('date', 'desc')
                                                .limit(QUERY_LIMIT);
            const snapshot = await notificationsRef.get();
            if(snapshot.empty){
                return;
            }

            let fetchedNotifications = [];
            snapshot.forEach(doc => {
                fetchedNotifications = [...fetchedNotifications, {...doc.data(), ref: doc.id}]
            });
            setNotifications(fetchedNotifications);
            setQuery({
                ref: notificationsRef,
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            });
        };

        fetchNotifications();
    },[currentUser.id, currentYear]);

    const addPaginatedNotifications = async () => {
        const { ref, lastDoc } = query;

        try{
            if(lastDoc){
                const next = ref.startAfter(lastDoc.data().date);
                const snapshot = await next.get();
                const fetchedNotifications = snapshot.docs.map(doc => doc.data());
                const last = snapshot.docs[snapshot.docs.length - 1];

                setNotifications([...notifications, ...fetchedNotifications]);
                setQuery({
                    ...query,
                    lastDoc: last
                });
            } else {
                alert('You are viewing all notifications. There is no notification to load.')
            }
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className={classes.root}>
            {
            notifications.length ?
            (
                <>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="notifications table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="left">Notification</TableCell>
                                <TableCell align="left">Link</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {notifications.map((notification, index) => ( 
                            <TableRow hover key={index}>
                                <TableCell>{new Date(notification.date.seconds * 1000).toLocaleDateString()}</TableCell>
                                <TableCell>{notification.message}</TableCell>
                                <TableCell>
                                {
                                    notification.viewLink ? 
                                    (<Link to={notification.viewLink}>Click Here to View</Link>)
                                    : ''
                                }
                                </TableCell>
                            </TableRow>
                        ))
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={() => addPaginatedNotifications()}>
                Load more
                </Button>
                </>
            ) : ( 
                <h3>You have no notifications.</h3>
            )
            }
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear
})

export default connect(mapStateToProps)(NotificationsPage);
