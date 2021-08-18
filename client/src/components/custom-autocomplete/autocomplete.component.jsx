import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const CustomAutocomplete = ({ id, options, label, name, handleChange}) => {

  return (
    <Autocomplete
      id={id}
      options={options}
      getOptionLabel={option => `${option.firstName}, ${option.lastName}`}
      style={{ width: 300 }}
      renderInput={
        (params) => (
          <TextField 
          {...params} 
          name={name} 
          onChange={handleChange} 
          label={label} 
          variant="standard" 
          />
        )
      }
    />
  );
};

export default CustomAutocomplete;