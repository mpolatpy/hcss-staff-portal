import { useState, useEffect } from 'react';

import { firestore } from '../../firebase/firebase.utils';
import axios from 'axios';
import { createScheduleArray } from './observation-info.utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>  ({ 
    root: {
        width: '55vw',
        marginTop: theme.spacing(2),
        '& .MuiTableCell-head': {
            backgroundColor: '#3f51b5',
            color: '#fff'
        }   
    },
    link: {
        textDecoration: 'none'
    }
}));

const TeacherScheduleTable = ({teacher, currentYear}) => {
    const days = [['A', 'Mon'], ['B','Tue'], ['C','Wed'], ['D','Thu'], ['E','Fri']];
    const blocks = ['B1', 'B2', 'B3', 'B4', 'B5', 'SH'];
    const classes = useStyles();
    const [isLoading, setLoading] = useState(false);
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
            setLoading(true);
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
          } finally {
            setLoading(false);
          }
        };
    
        if (teacher !== null) getTeacherSchedule();
    
      }, [teacher, currentYear]);

    return ( 
        
            isLoading ? (
                <CircularProgress />
            ) : ( 
                
            Object.keys(schedule).length ? ( 
            <div className={classes.root}>
            <Typography variant="h6">{`Weekly Schedule - ${teacher.firstName} ${teacher.lastName}`}</Typography>
            <TableContainer component={Paper}>
                <Table stickyHeader >
                    <TableHead >
                        <TableRow>
                            <TableCell>Days</TableCell>
                            {
                                blocks.map( (block, i) => (
                                    <TableCell key={`block-${i}`}>{block}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            days.map( day => (
                                <TableRow hover key={`day-${day[0]}`}>
                                    <TableCell>{day[1]}</TableCell>
                                    {
                                        schedule[day[0]].map( (block, j) => (
                                            <TableCell key={`block-${day[0]}-${j}`}>
                                                <>
                                                    <Typography variant="body2">{`${block.course_name || ''} - ${block.section_number || ''}`}</Typography>
                                                    <Typography variant="body2">{block.room ? `Room: ${block.room}` : ''}</Typography>
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
                ): null
                
            )
                
        
        
    )

};

export default TeacherScheduleTable;