import {useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import {selectCurrentYear} from '../../redux/school-year/school-year.selectors';
import { selectTeacher } from '../../redux/teachers/teachers.selectors';

import ObservationChartByType from '../observation-chart-by-type/observation-chart-by-type.component';
import { CircularProgress, Typography } from '@material-ui/core';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

const TeacherObservationsComponent = ({teacher, currentYear}) => {
    const classes = useStyles();
    const [state, setState] = useState({
        isLoading: false,
        observationScores: null,
        lessonPlanScore: null
    });

    const observationMap = {
        "weeklyObservationScores": "Weekly Observations",
        "fullClassObservationScores": "Full Class Observations",
        "quarterScores": "Quarter Evaluations",
        "midyearScores": "Midyear Evaluation",
        "finalEvals": "End of Year Evaluation"
    };

    const observationTypes = [ 
        "weeklyObservationScores",
        "fullClassObservationScores",
        "quarterScores",
        "midyearScores",
        "finalEvals"
    ];

    const slugs = [
        'weekly',
        'full-class',
        'quarterly',
        'midyear',
        'end-of-year'
    ];

    useEffect(() => {
        const teacherId = teacher.id;
        setState({
            ...state,
            isLoading: true,
        })
        const getObservtionScores = async () => {
            const fetchedObservationScores = {};
            
            observationTypes.forEach( async function(scoreType){
                const scoreRef = firestore.doc(`observationScores/${currentYear}/${scoreType}/${teacherId}`);
                const score = await scoreRef.get();

                if (score.exists){
                    fetchedObservationScores[scoreType] = score.data();
                } else {
                    fetchedObservationScores[scoreType] = null;
                }
            });

            const lessonPlanScoreRef = firestore.doc(`lessonPlanScores/${currentYear}/summary/${teacherId}`);
            const lessonPlanData = await lessonPlanScoreRef.get();
            let lpScore = null;

            if(lessonPlanData.exists){
                lpScore = lessonPlanData.data();
            }

            setState({
                observationScores: fetchedObservationScores,
                lessonPlanScore: lpScore,
                isLoading: false
            });
        }; 
        
        getObservtionScores();
        
    }, [teacher]);

    return ( 
        <>
            <Typography variant="h6">{`Observations - ${teacher.firstName} ${teacher.lastName}`}</Typography>
            <Divider />
            {
                state.isLoading ?
                ( 
                    <div>
                        <CircularProgress />
                    </div>
                ) : (
                    state.observationScores && (
                        <div>
                        <div className={classes.root}>
                        {
                        observationTypes.map((observationType, index) =>(
                            state.observationScores[observationType] && (
                                <Accordion defaultExpanded={index === 0} key={index}>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`${observationType}-content`}
                                    id={`${observationType}-header`}
                                    >
                                    <Typography variant="h6" >{observationMap[observationType]}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems:"flex-start" }}>
                                            <ObservationChartByType score={state.observationScores[observationType]}/>
                                            <div style={{marginTop:'5px', display: 'flex', alignItems:"flex-end",}}>
                                                <Button color="primary" component={Link} to={`/staff/observations/${slugs[index]}/${teacher.id}`}>View Details</Button>
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        ))
                        }
                        </div>
                        
                        {/* <Grid container justifyContent="center" alignItems="flex-start" >
                        {observationTypes.map((observationType, index) =>(
                            state.observationScores[observationType] && (
                            <Grid item sm={12} md={6} key={index} style={{padding: '10px'}}>
                                <Paper variant="outlined" style={{padding: '10px'}}>
                                    <Typography variant="h6">{observationType}</Typography>
                                    <ObservationChartByType score={state.observationScores[observationType]}/>
                                    <div style={{marginTop:'5px', display: 'flex', justifyContent:"flex-end",}}>
                                    <Button component={Link} to="#">View Details</Button>
                                    </div>
                                </Paper>
                            </Grid>
                            )
                        ))}
                        </Grid> */}
                        </div>
                    )
                )
            }
        </>
    )

}

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
    currentYear: selectCurrentYear(state)
});

export default connect(mapStateToProps)(TeacherObservationsComponent);