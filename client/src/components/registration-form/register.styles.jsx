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
    textInput: {
        margin: theme.spacing(1),
        width: '30vw',
        minWidth: 270,
    },
    button: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(9),
        alignSelf: 'flex-start'
    }
}));

export default useStyles;
