export const filterCurrentUserData = (data, currentUser, columns, filterColumn, filterProperty) => {
    const index = data[0].indexOf(filterColumn);
    const filteredData = data.filter( row => row[index] === currentUser[filterProperty])
                            .map(row => mapRow(row, columns));

    return filteredData;
};

export const mapRow = (row, columns) => {
    const mappedRow = columns.map (i => row[i]);

    return mappedRow;
};