import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

const AccordionHOC = (AccordionHeader, AccordionContent) => {

    const AccordionRow = (props) =>  {
        const classes = useStyles();
        const { name } = props;
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
                            <AccordionHeader {...props}/>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails >
                        <AccordionContent {...props} />
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    };

    return AccordionRow;

}

export default AccordionHOC;
