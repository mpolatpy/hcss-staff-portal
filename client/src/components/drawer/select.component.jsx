import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useStyles } from './drawer-select.styles';

const DrawerSelect = ({years, currentYear, handleChange, year}) => {
  const classes = useStyles();

  const iconComponent = () => {
    return (
      <ExpandMoreIcon className={classes.icon}/>
    )};

  // moves the menu below the select input
  const menuProps = {
    classes: {
        paper: classes.paper,
        list: classes.list
      },  
    anchorOrigin: {
      vertical: "bottom",
        horizontal: "left"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "left"
    },
    getContentAnchorEl: null
  };

  return (
    <FormControl>
      <Select
        disableUnderline
        className={classes.select}
        MenuProps={menuProps}
        IconComponent={iconComponent}
        value={year}
        onChange={handleChange}
      >
          {
              years.length ? years.map((year, idx) => ( 
                <MenuItem key={idx} value={year}>{year}</MenuItem>
              )) : ( 
                <MenuItem value={currentYear}>{currentYear}</MenuItem>
              )
          }
      </Select>
    </FormControl>
  );
};

export default DrawerSelect;