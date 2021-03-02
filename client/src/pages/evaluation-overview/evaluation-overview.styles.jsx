import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
    root: {
        '& .teacher-list-header': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText
        },
        // '& .rating-cell.exceeding': {
        //     backgroundColor: "#a5d6a7",
        //     color: theme.palette.success.contrastText
        // },
        // '& .rating-cell.meeting': {
        //     backgroundColor: "#b2dfdb",
        //     color: theme.palette.success.contrastText
        // },
        // '& .rating-cell.partially': {
        //     backgroundColor: "#fbc02d",
        //     color: theme.palette.warning.contrastText
        // },
        // '& .rating-cell.notMeeting': {
        //     backgroundColor: "#ffccbc",
        //     color: theme.palette.error.contrastText
        // }
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(0)
    },
    wrappedCell: {
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    }
}));

