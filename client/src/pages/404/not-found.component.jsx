import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const NotFound = (props) => {
    
    return (
    <div>
        <h1>404 - Page Not Found!</h1>
        <Button component={Link} variant="contained" to='/home' color="primary">Back to Home Page</Button>
    </div>
    );
}

export default NotFound;