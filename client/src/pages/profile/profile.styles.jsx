import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({ 
    profilePage:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        alignItems:'space-around',
    },
    profileCard: {
        flexGrow:1, 
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        border: "1px solid",
        borderColor: "#d3d3d3",
        borderRadius: "15px",
        boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        marginRight: theme.spacing(5),
        padding: theme.spacing(3)
    }
}));