import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import { Divider, List, Link, ListItem, Typography } from '@material-ui/core';
import { firestore } from '../../firebase/firebase.utils';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ObservationInfoModal({ teacher, currentYear, courses }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [observations, setObservations ] = useState([]);

  useEffect(() => {
    const fetchSavedObservations = async () => {
        try{
            const observationRef = firestore.collection('savedObservations')
                                    .where('observationDetails.teacher.id', '==', teacher.id)
                                    .where('observationDetails.schoolYear', '==', currentYear)
                                    .orderBy('observationDate', 'desc')
            const snapshot = await observationRef.get();
            const fetchedObservations = snapshot.docs.map(doc => doc.data());
            setObservations(fetchedObservations);
        }catch(e) {
            console.log(e.message)
        }
    }

    if(teacher !== null ){
        fetchSavedObservations();
    }

  },[teacher]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton type="button" color="primary" onClick={handleOpen}>
        <InfoOutlinedIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
        <div className={classes.paper}>
            {
                !teacher ? ( 
                    <Typography>No teacher selected. Please select a teacher to view information.</Typography>
                ):
                (observations.length === 0 ?
                ( 
                <div>
                    <Typography>{`There is no saved observation for ${teacher.lastName}, ${teacher.firstName}`}</Typography>  
                </div>
                ) : ( 
                <div>
                    <Typography variant="h6">Scheduled Observations</Typography>
                    <Divider/>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="right">Block</TableCell>
                                    <TableCell>Observer</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    observations && observations.map( observation => ( 
                                        <TableRow key={observation.firestoreRef.id}>
                                            <TableCell>{new Date(observation.observationDetails.observationDate.seconds*1000).toLocaleDateString("en-US")}</TableCell>
                                            <TableCell>{observation.observationDetails.block}</TableCell>
                                            <TableCell>{`${observation.observationDetails.observer.lastName}, ${observation.observationDetails.observer.firstName}`}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br/>
                    <Typography variant="h6">Canvas Links</Typography>
                    <Divider/>
                    <List>
                        {
                          (courses && courses.length > 0) ? (
                            courses.map( (course, index) => (
                                <ListItem key={index}>
                                    <Link href={`https://hcss.instructure.com/courses/${course.id}`} target="_blank" rel="noopener">
                                        {course.name}
                                    </Link>
                                </ListItem>
                            )) 
                          ): null
                        }
                    </List>
                </div>
                ))
            }
        </div>
        </Fade>
      </Modal>
    </div>
  );
}
