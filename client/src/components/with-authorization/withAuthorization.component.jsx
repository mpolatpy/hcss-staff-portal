import React from 'react';


const withAuthorization = (allowedRoles) => (WrappedComponent) => {

    const Authorization = ({ currentUser, ...otherProps }) => {

        return currentUser && allowedRoles.includes(currentUser.role) ? ( 
            <WrappedComponent currentUser={currentUser} {...otherProps}/>
        ) : ( 
            <div>
                <h3>You do not have access to this page.</h3>
            </div>
        )
    };

    return Authorization;
};

export default withAuthorization;