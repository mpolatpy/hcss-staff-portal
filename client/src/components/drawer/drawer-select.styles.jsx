import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  select: {
    width: 80,
    color: theme.palette.info.contrastText,
    fontWeight:200,
    borderStyle:'none',
    borderWidth: 2,
    paddingTop: 10,
    
    "&:focus":{
      borderRadius: 12,
      background: 'white',
    },
  },
  icon:{
    right: 12,
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none'
  },
  paper: {
    borderRadius: 2,
    marginTop: 8
  },
  list: {
    paddingTop:0,
    paddingBottom:0,
    background:'white',
    "& li":{
      fontWeight:200,
      paddingTop:12,
      paddingBottom:12,
    },
  }
}));