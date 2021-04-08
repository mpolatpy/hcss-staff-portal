import { makeStyles } from '@material-ui/core/styles';


export const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        // boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
    },
    items: {
        marginTop: theme.spacing(1),
    },
    buttons: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    button2: {
        marginLeft: theme.spacing(1)
    },
    loading: {
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));