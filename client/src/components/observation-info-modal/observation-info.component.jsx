import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import { List, Link, ListItem, Typography } from '@material-ui/core';
import { firestore } from '../../firebase/firebase.utils';
import axios from 'axios';
import { createScheduleArray } from './observation-info.utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import TeacherScheduleTable from './teacher-schedule-table';
import SavedObservationsTable from './saved-observations-table';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    top:'10%',
    left:'10%',
    overflow:'scroll',
    height:'100%',
    display:'block',
    '& .MuiTableCell-head': {
      backgroundColor: '#3f51b5',
      color: '#fff'
    }
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minWidth: '50vw'
  },
}));

export default function ObservationInfoModal({ teacher, currentYear, courses }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [observations, setObservations] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchoolYear = async () => {
      const ref = firestore.collection('years');
      const snapshot = await ref.get();
      const years = {};
      if (!snapshot.empty) {
        snapshot.docs.forEach(doc => years[doc.id] = doc.data());
      }

      return years[currentYear];
    };

    const getTeacherSchedule = async () => {
      const schoolYear = await fetchSchoolYear();
      const activeTerms = schoolYear.activePsTerms;
      const queryParam = `teachers.dcid==${teacher.powerSchoolId}`;
  
      try{
          const response = await axios.post('/get-powerschool-data', {
                  url: 'https://hcss.powerschool.com/ws/schema/query/com.hcss.admin.teacher_schedules',
                  queryParam: queryParam,
              }
          );
          
          if(response.data && response.data.status === 'success') {
            const scheduleData = response.data.result.filter( 
              course => activeTerms.includes(course.termid)
            );

            const schedule = createScheduleArray(scheduleData);
            setSchedule(schedule);
          }
      } catch(e){
          console.log(e);
      } 
    };

    const fetchSavedObservations = async () => {
      try {
        const observationRef = firestore.collection('savedObservations')
          .where('observationDetails.teacher.id', '==', teacher.id)
          .where('observationDetails.schoolYear', '==', currentYear)
          .orderBy('observationDate', 'desc')
        const snapshot = await observationRef.get();
        const fetchedObservations = snapshot.docs.map(doc => doc.data());
        setObservations(fetchedObservations);
      } catch (e) {
        console.log(e.message)
      }
    }

    if (teacher !== null) {
      setLoading(true);
      fetchSavedObservations();
      getTeacherSchedule();
      setLoading(false);
    }

  }, [teacher, currentYear]);

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
          {
            isLoading ? (
              <CircularProgress />
            ) : ( 
          <div className={classes.paper}>
            <Paper variant="outlined">
              <Typography variant="caption" style={{ marginBottom:'10px'}}>Use 'ESC' to exit the information screen.</Typography>
            </Paper>
            {
              !teacher && (
                <Typography>No teacher selected. Please select a teacher to view information.</Typography>
              )
            }
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                {
                  teacher && (
                  <>
                  <SavedObservationsTable observations={observations} teacher={teacher}/>
                  <div style={{ marginTop: '10px'}}>
                    <Typography variant="h6">Canvas Links</Typography>
                    <List>
                      {
                        (courses && courses.length > 0) ? (
                          courses.map((course, index) => (
                            <ListItem key={index}>
                              <Link href={`https://hcss.instructure.com/courses/${course.id}`} target="_blank" rel="noopener">
                                {course.name}
                              </Link>
                            </ListItem>
                          ))
                        ) : null
                      }
                    </List>
                  </div>
                  </>
                  )
                }
              </Grid>
              <Grid item xs={12} md={7}>
                {
                    Object.keys(schedule).length && ( 
                    <TeacherScheduleTable 
                      teacher={teacher}
                      schedule={schedule}
                    />
                    )
                  }
              </Grid>
            </Grid>
            
            {/* {
              !teacher ? (
                <Typography>No teacher selected. Please select a teacher to view information.</Typography>
              ) :(
                <>
                  <SavedObservationsTable observations={observations} teacher={teacher}/>
                  <Paper variant="outlined">
                    <Typography variant="h6">Canvas Links</Typography>
                    <List>
                      {
                        (courses && courses.length > 0) ? (
                          courses.map((course, index) => (
                            <ListItem key={index}>
                              <Link href={`https://hcss.instructure.com/courses/${course.id}`} target="_blank" rel="noopener">
                                {course.name}
                              </Link>
                            </ListItem>
                          ))
                        ) : null
                      }
                    </List>
                  </Paper>
                  {
                    Object.keys(schedule).length && ( 
                    <TeacherScheduleTable 
                      teacher={teacher}
                      schedule={schedule}
                    />
                    )
                  }
                  </>
                )
            } */}
          </div>
            )
          }
        </Fade>
      </Modal>
    </div>
  );
}
