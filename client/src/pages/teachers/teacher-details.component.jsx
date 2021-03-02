import React from 'react';
import { connect } from 'react-redux';
import { selectTeacher } from '../../redux/teachers/teachers.selectors';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    card: {
        minWidth: '400px',
        padding: theme.spacing(2)
    }
}));

const TeacherDetails = ({teacher} ) => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <Typography variant="h6">{`Page for ${teacher.firstName} ${teacher.lastName}`}</Typography>
            <Divider/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    teacher: selectTeacher(ownProps.match.params.teacherId)(state),
})

export default connect(mapStateToProps)(TeacherDetails);