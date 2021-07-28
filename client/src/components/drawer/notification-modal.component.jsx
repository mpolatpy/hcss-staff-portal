import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import { makeStyles } from "@material-ui/styles";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '400px'
    },
    modalContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-around'
    }
}))

const NotificationModal = ({notifications, currentYear, currentUser, setNotifications}) => {
    const classes = useStyles();

    useEffect(() => {

        const disableNotification = async (notification) => {
            const ref = firestore.doc(`notifications/${currentYear}/${currentUser.id}/${notification.ref}`);
            try{
                await ref.set({
                    ...notification,
                    display: false
                })
            } catch(e) {
                console.log(e.message)
            }
        };

        notifications.forEach((notification) => disableNotification(notification) )

        return () => setNotifications([]);

    }, [currentYear, currentUser.id, notifications]);

    return (
        <div className={classes.root}>
            {
            notifications.length ?
            (
                <TableContainer component={Paper}>
                    <Table >
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
                                <TableCell><Link to={notification.viewLink}>Click Here to View</Link></TableCell>
                            </TableRow>
                        ))
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : ( 
                <h3>You have no active notifications.</h3>
            )
            }
        </div>
    )
};

export default NotificationModal;
