import React from 'react';

import { Typography } from '@material-ui/core';
import CustomAccordion from '../../accordion/accordion.component';
import { useStyles } from './observation-standard.styles';

const ObservationStandardComponent = ({ domain, domainRdx, setDomainRdx, readOnly }) => {

    const classes = useStyles();
    const components = domain.components;
    const componentKeys = Object.keys(components);

    const handleStarChange = (event) => {
        const { name, value } = event.target;
        
        setDomainRdx({
            ...domainRdx,
            [name]: parseInt(value)
        });
    }

    return ( 
        <div className={classes.observationDomain}>
            <div className={classes.observationDomainInner}>
                <Typography variant="h6">{domain.domainName}</Typography>
                {
                    componentKeys.map(key =>
                        <CustomAccordion
                            key={key}
                            readOnly={readOnly}
                            observationItem={components[key]}
                            name={key}
                            label={components[key].componentName}
                            value={parseInt(domainRdx[key])}
                            handleStarChange={handleStarChange}
                        />
                    )
                }
            </div>
        </div>
    );
};



export default ObservationStandardComponent;

