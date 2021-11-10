import { useState } from 'react';
import TestResultCounts from "./test-results-counts";
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import CustomSelect from '../../components/custom-select/custom-select.component';

const SectionTestResults = ({ results, isLoading, header }) => {
    const [selection, setSelection] = useState('All');
    const [display, setDisplay] = useState(results);
    const ratingIndex= header.length ? header.indexOf('Proficiency Rating') : null;
    const ratings = {
        'Exceeding Expectations': 'E',
        'Meeting Expectations': 'M',
        'Partially Meeting Expectations': 'PM',
        'Not Meeting Expectations': 'NM'
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setSelection(value);

        if (value === 'All') {
            setDisplay(results);
        } else {
            const rating = ratings[value];
            const displayResults = results.filter(row => row[ratingIndex] === rating);
            setDisplay(displayResults);
        }
    }

    return (
        <div>
            <TestResultCounts
                results={results}
                ratingIndex={ratingIndex}
            />
            <CustomSelect
                style={{ maxWidth: 270 }}
                variant="outlined"
                label="Students by Proficiency Rating"
                name="observationType"
                handleSelect={handleChange}
                value={selection}
                options={['All', 'Exceeding Expectations', 'Meeting Expectations', 'Partially Meeting Expectations', 'Not Meeting Expectations']}
            />
            <CustomSpreadSheetTable
                records={display}
                header={header}
                isLoading={isLoading}
            />
        </div>
    )

}

export default SectionTestResults;