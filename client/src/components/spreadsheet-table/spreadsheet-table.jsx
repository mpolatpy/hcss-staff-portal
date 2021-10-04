import { useEffect, useState } from 'react';
import { fetchSpreadSheetData } from './spreadsheet-table.utils';
import CustomSpreadSheetTable from './custom-spreadsheet-table';

const SpreadSheetTable = ({ spreadSheetInfoRef, currentUser }) => {

    const [records, setRecords] = useState([]);
    const [header, setHeader] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        fetchSpreadSheetData(
            spreadSheetInfoRef,
            currentUser,
            setLoading,
            setHeader,
            setRecords
        );
    }, [spreadSheetInfoRef, currentUser]);


    return (
        records.length ? (
            <CustomSpreadSheetTable
                records={records}
                header={header}
                isLoading={isLoading}
            />
        ) : null
    )
};

export default SpreadSheetTable;


