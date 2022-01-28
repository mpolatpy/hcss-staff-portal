import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CustomAccordionContent from './accordion-content';

import StarRating from '../star-rating/star-rating.component';


const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    accordion: {
        boxShadow: 'none',
    },
    accordionHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    accordionSummary: {
        borderBottom: 'none',
        boxShadow: '0'
    }
});

export default function CustomAccordion(props) {
    const classes = useStyles();
    const { name, label, value, handleStarChange, readOnly} = props;

    return (
        <div className={classes.root}>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    className={classes.accordionSummary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id={`action-header-for-${name}`}
                >
                    <div className={classes.accordionHeader}>
                        <Typography variant="subtitle1">{label}</Typography>
                        <StarRating
                            readOnly={readOnly}
                            name={name}
                            value={value}
                            handleStarChange={handleStarChange}
                        />
                    </div> 
                </AccordionSummary>
                <AccordionDetails >
                    <CustomAccordionContent {...props}/>
                </AccordionDetails>
            </Accordion>
     
        </div>
    );
}
