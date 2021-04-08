import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
            {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    display: 'flex',
    maxHeight: 480,
    minHeight: 350,
    // border: "1px solid",
    // borderColor: "#d3d3d3",
    // borderRadius: "5px",
    // boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs({labels, contents}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    labels.length > 0 ?
    ( 
        <div className={classes.root}>
            <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
        >
            { labels.map( 
                (label, index) => (<Tab label={label} key={`${label}-${index}`} {...a11yProps(index)} />)     
            )}
        </Tabs>
        {
            contents.map( 
                (item, index) => 
                (<TabPanel value={value} key={`tabpanel${index}`} index={index}>
                    {item}
                </TabPanel>
            ))
        }
        </div>

    ): null 
  );
}
