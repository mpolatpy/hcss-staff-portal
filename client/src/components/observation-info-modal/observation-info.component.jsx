import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import { List, Link, ListItem, Typography } from '@material-ui/core';

import TeacherScheduleTable from './teacher-schedule-table';
import SavedObservationsTable from './saved-observations-table';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  modal: {
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
            <Paper variant="outlined">
              <Typography variant="caption" style={{ padding:'10px'}}>Use 'ESC' to exit the information screen.</Typography>
            </Paper>
            
            { teacher && (
              <Typography variant="h5" style={{ marginTop:'10px', textAlign:"center" }}>
                {`Observation Planning Information for ${teacher.firstName} ${teacher.lastName}`}
              </Typography>
            )}
            {
              !teacher && (
                <Typography>No teacher selected. Please select a teacher to view information.</Typography>
              )
            }
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                {
                  teacher && (
                    <SavedObservationsTable 
                      currentYear={currentYear} 
                      teacher={teacher}
                    />
                  )
                }
              </Grid>
              <Grid item xs={12} md={7}>
                    <TeacherScheduleTable 
                      teacher={teacher}
                      currentYear={currentYear}
                    />
                  {
                  teacher && (
                  <Grid container direction="row" justifyContent="space-evenly" alignItems="flex-start" spacing={3}>
                    <Grid item style={{ marginTop: '10px'}}>
                      <Paper style={{ padding: '10px'}} >
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
                    </Grid>
                    <Grid item style={{ marginTop: '10px'}}>
                      <Paper style={{ padding: '10px'}} >
                        <Typography variant="h6">Bell Schedule</Typography>
                        <Link href="https://docs.google.com/spreadsheets/d/1_EumEoSGHBQVCEu5PMUKdMdp8AJxEoVy2CFlIXrkA2U/edit#gid=0" target="_blank" rel="noopener">
                          Bell Schedules 21-22
                        </Link>
                      </Paper>
                    </Grid>
                  </Grid>
                  )
                }
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
