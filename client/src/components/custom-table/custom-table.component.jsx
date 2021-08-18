import React from 'react';

import { DataGrid } from '@material-ui/data-grid';


const DataTable = ({ rows, columns, pageSize, customStyle, checkboxSelection, rowsPerPageOptions, rowHeight }) => {
    return (
        <div style={customStyle ? {...customStyle} : { height: 600, width: '100%', overflowX: 0 }}>
            <DataGrid 
            rows={rows} 
            columns={columns} 
            rowHeight={rowHeight}
            pageSize={pageSize} 
            checkboxSelection={checkboxSelection}
            rowsPerPageOptions={rowsPerPageOptions}
            />
        </div>
    );
}

export default DataTable;



