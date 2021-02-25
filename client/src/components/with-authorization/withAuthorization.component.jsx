import React from 'react';


const withAuthorization = (allowedRoles) => (WrappedComponent) => {

    const Authorization = ({ currentUser, ...otherProps }) => {

        return currentUser && allowedRoles.includes(currentUser.role) ? ( 
            <WrappedComponent {...otherProps}/>
        ) : ( 
            <div>
                <h1>You do not have access to this page.</h1>
            </div>
        )
    };

    return Authorization;
};

export default withAuthorization;