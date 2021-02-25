import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    form_items: { 
        padding: theme.spacing(2),
        // textAlign: 'center',
        // margin: theme.spacing(2)
    },
    card: {
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: "1px solid",
        borderColor: "#d3d3d3"
    },
    formRow: {
        marginBottom: theme.spacing(1),
        // display: 'flex',
        width: "80%",
        // flexDirection: 'center',
        justifyContent: 'space-around'
    },
    newDivMain: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'space-around',
        justifyContent: 'center',
        // border: "1px solid",
        // borderColor: "#d3d3d3",
        // borderRadius: "5px",
        // boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        padding: theme.spacing(2)
    }
}));