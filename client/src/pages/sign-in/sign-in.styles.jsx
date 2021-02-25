import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing(10),
    },
    sign_in_container:{
        border: "2px solid",
        borderColor: "#d3d3d3",
        borderRadius: '10px',
        boxShadow: '16px 160px 160px #d3d3d3',
    },
    innerDiv: {
        padding: theme.spacing(3)
    },
    form_input: {
      marginTop: theme.spacing(2),
    },
    logo: {
        marginTop: theme.spacing(5),
        textAlign: "center",
    },
    sign_in_button: {
        marginTop: theme.spacing(2),
        color: 'white',
        backgroundColor: "#1976d2",
        "&:hover, &:focus": {
            backgroundColor: "#115293"
        }
    },
    sign_in_text: {
        marginBottom: theme.spacing(0)
    },
    errorMessage: {
        marginTop: theme.spacing(1)
    }
}));

export default useStyles;