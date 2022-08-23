import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing(1),
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: '10px',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    mainContainer:{
        display: 'flex',
        flexDirection: 'row',
    },
    courses:{
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: '10px',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2)
    },
    textInput: {
        minWidth: 270,
        width: '30vw',
        marginBottom: theme.spacing(2)
    }
}));

export default useStyles;
