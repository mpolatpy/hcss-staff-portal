import { firestore } from '../../firebase/firebase.utils';
import axios from "axios";


export const fetchSpreadSheetData = async (spreadSheetInfoRef, currentUser, setLoading, setHeader, setRecords) => {
    setLoading(true);
    const spreadSheetInfo = await fetchSpreadSheetInfo(spreadSheetInfoRef);
    if(!spreadSheetInfo ) {
        setLoading(false);
        return;
    }

    const { spreadsheetId, range, columns, filterColumn, filterProperty } = spreadSheetInfo;

    try{
        const response = await axios.post('/read-google-sheets-data', {
            options: {
                spreadsheetId,
                range,
            }
        });

        if(response.data && response.data.status === 'success'){
            setHeader(mapRow(response.data.result[0], columns));
            setRecords( filterCurrentUserData( 
                response.data.result, currentUser, columns, filterColumn, filterProperty
            ));
        }
    } catch (e) {
        console.log(e);
    }

    setLoading(false);
};

const filterCurrentUserData = (data, currentUser, columns, filterColumn, filterProperty) => {
    const index = data[0].indexOf(filterColumn);
    const filteredData = data.filter( row => row[index] === currentUser[filterProperty])
                            .map(row => mapRow(row, columns));

    return filteredData;
};

const mapRow = (row, columns) => {
    const mappedRow = columns.map (i => row[i]);

    return mappedRow;
};

const fetchSpreadSheetInfo = async (spreadSheetInfoRef) => {
    let spreadSheetInfo = null;
    const ref = firestore.doc(spreadSheetInfoRef);
    const snapshot = await ref.get();
    
    if(snapshot.exists) spreadSheetInfo = snapshot.data();
    return spreadSheetInfo;
};