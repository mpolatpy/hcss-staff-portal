import { firestore } from '../../firebase/firebase.utils';
import axios from "axios";


export const fetchSpreadSheetData = async (spreadSheetInfoRef, currentUser, setLoading, setHeader, setRecords) => {
    setLoading(true);

    const spreadsheetData = await getSpreadSheetData(spreadSheetInfoRef);
    console.log(spreadsheetData);
    if (!spreadsheetData) {
        setLoading(false);
        return;
    }
    const { data, spreadSheetInfo } = spreadsheetData;
    const { columns, filterColumn, filterProperty } = spreadSheetInfo;
    const header = mapRow(data[0], columns);
    setHeader(header);
    const records = filterCurrentUserData(data, currentUser, columns, filterColumn, filterProperty);
    
    setRecords(records);

    setLoading(false);
    return {records, header};
};

export const getSpreadSheetData = async (spreadSheetInfoRef) => {
    const spreadSheetInfo = await fetchSpreadSheetInfo(spreadSheetInfoRef);

    if (!spreadSheetInfo) {
        return null;
    }
    const { spreadsheetId, range } = spreadSheetInfo;

    try {
        const response = await axios.post('/read-google-sheets-data', {
            options: {
                spreadsheetId,
                range,
            }
        });

        if (response.data && response.data.status === 'success') {
            return {
                data: response.data.result,
                spreadSheetInfo
            };
        }
    } catch (e) {
        console.log(e);
    }

    return null;
};

export const filterCurrentUserData = (data, currentUser, columns, filterColumn, filterProperty) => {
    const index = data[0].indexOf(filterColumn);
    const filteredData = data.filter(row => row[index] === currentUser[filterProperty])
        .map(row => mapRow(row, columns));

    return filteredData;
};

export const mapSpreadsheetData = (data, columns, filterColumn) => {

    const index = data[0].indexOf(filterColumn);
    const spreadsheetMap = {};

    for (let row of data) {
        const val = row[index];
        if (val in spreadsheetMap) {
            spreadsheetMap[val] = [...(spreadsheetMap[val]), mapRow(row, columns)];
        } else {
            spreadsheetMap[val] = [mapRow(row, columns)];
        }
    }

    return spreadsheetMap;
};

export const mapRow = (row, columns) => {
    const mappedRow = columns.map(i => row[i]);

    return mappedRow;
};

const fetchSpreadSheetInfo = async (spreadSheetInfoRef) => {
    let spreadSheetInfo = null;
    const ref = firestore.doc(spreadSheetInfoRef);
    const snapshot = await ref.get();

    if (snapshot.exists) spreadSheetInfo = snapshot.data();
    return spreadSheetInfo;
};