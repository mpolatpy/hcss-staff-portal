import {useState} from 'react';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
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
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      '& .MuiTabs-flexContainer': {
        backgroundColor: theme.palette.background.default
      }
    },
  }));
  
  export default function SimpleTabs({labels, contents}) {
    const classes = useStyles();
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <div className={classes.root}>
        <Tabs 
        indicatorColor="primary" 
        textColor="primary" 
        value={value} 
        onChange={handleChange} 
        aria-label="tabs"
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
    );
  }
  