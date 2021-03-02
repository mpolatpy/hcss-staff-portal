import { makeStyles } from '@material-ui/core/styles';


export const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "5px",
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        padding: theme.spacing(5)
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    resetSaveButtons: {
        display: 'flex',
        alignSelf: 'flex-end'
    },  
    resetContainer: {
        padding: theme.spacing(3),
    },
    stepContainer: {
        display: 'flex',
        flexDirection: 'row',
    }
}));

