import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase/firebase.utils';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ObservationChartByType from '../observation-chart-by-type/observation-chart-by-type.component';
import { CircularProgress } from "@material-ui/core";

const ObservationAccordion = ({ index, teacher, observationType, currentYear }) => {
    const [observationScores, setObservationScores] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const teacherId = teacher ? teacher.id : null;

    const observationMap = {
        "weeklyObservationScores": {
            name: "Weekly Observations",
            slug: 'weekly'
        },
        "fullClassObservationScores": {
            name:"Full Class Observations",
            slug: 'full-class'
        },
    };

    useEffect(() => {
        const getObservationScores = async () => {
            if (!teacher) return;

            setIsLoading(true);
            const scoreRef = firestore.doc(`observationScores/${currentYear}/${observationType}/${teacherId}`);
            const score = await scoreRef.get();

            if (score.exists) {
                setObservationScores(score.data());
            }
            setIsLoading(false);
        };

        getObservationScores();
    }, [teacherId, currentYear]);

    if (isLoading) {
        return (
            <CircularProgress />
        );
    }

    return (
                observationScores && teacherId ? (
                    <Accordion defaultExpanded={index === 0}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${observationType}-content`}
                            id={`${observationType}-header`}
                        >
                            <Typography variant="h6" >{observationMap[observationType].name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: "flex-start" }}>
                                <ObservationChartByType score={observationScores} />
                                <div style={{ marginTop: '5px', display: 'flex', alignItems: "flex-end", }}>
                                    <Button color="primary" component={Link} to={`/staff/observations/${observationMap[observationType].slug}/${teacherId}`}>View Details</Button>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ) : null
    )
};

export default ObservationAccordion;