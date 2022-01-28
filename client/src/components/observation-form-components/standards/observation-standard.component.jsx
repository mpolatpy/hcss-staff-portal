import React from 'react';

import { Typography } from '@material-ui/core';
import CustomAccordion from '../../accordion/accordion.component';
import { useStyles } from './observation-standard.styles';

const ObservationStandardComponent = ({ currentUser, domain, domainName, domainRdx, 
    setDomainRdx, readOnly, previousObservations }) => {

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

    const handleReset = (name) => {
        setDomainRdx({
            ...domainRdx,
            [name]: 0
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
                            currentUser={currentUser}
                            previousObservations={
                                (!readOnly && (currentUser.role === 'dci' || currentUser.role === 'superadmin')) 
                                ? previousObservations: null
                            }
                            observationItem={components[key]}
                            name={key}
                            domainName={domainName}
                            label={components[key].componentName}
                            value={parseInt(domainRdx[key])}
                            handleStarChange={handleStarChange}
                            handleReset={handleReset}
                        />
                    )
                }
            </div>
        </div>
    );
};



export default ObservationStandardComponent;

