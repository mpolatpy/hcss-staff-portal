import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'; 

export default function DatePicker({ label, name, selectedDate, handleDateChange, required }) {

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    required={required}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={label}
                    name={name}
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
        </MuiPickersUtilsProvider>
    );
}
