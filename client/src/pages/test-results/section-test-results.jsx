import { useMemo, useState } from 'react';
import TestResultCounts from "./test-results-counts";
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import CustomSelect from '../../components/custom-select/custom-select.component';

const ratings = {
    'Exceeding Expectations': 'E',
    'Meeting Expectations': 'M',
    'Partially Meeting Expectations': 'PM',
    'Not Meeting Expectations': 'NM'
};

const SectionTestResults = ({ results, isLoading, header, isAP }) => {
    const [selection, setSelection] = useState('All');
    const [test, setTest] = useState('');
    const [display, setDisplay] = useState(results);
    const ratingIndex = header.length ? header.indexOf('Proficiency Rating') : null; 
    const testIndex = header.length ? header.indexOf('Test Name') : null;

    const testOptions = useMemo(
        () => {
            return [...new Set(results.map(x => x[testIndex]))];
        }, [results, testIndex]
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        let filteredResults = results;

        if(name === 'selection'){
            setSelection(value);
            
            if(value !== 'All'){
                const rating = isAP ? value : ratings[value];
                filteredResults = filteredResults.filter(row => row[ratingIndex] === rating);
            }

            if(test !== ''){
                filteredResults = filteredResults.filter(row => row[testIndex] === test);
            }
        } else if (name === 'test'){
            setTest(value);
            if(value !== ''){
                filteredResults = filteredResults.filter(row => row[testIndex] === value);
            }
            if(selection !== 'All'){
                const rating = isAP ? selection : ratings[selection];
                filteredResults = filteredResults.filter(row => row[ratingIndex] === rating);
            }
        }
        setDisplay(filteredResults);
    }

    return (
        <div>
            <TestResultCounts
                isAP={isAP}
                results={display}
                ratingIndex={ratingIndex}
            />
            <div style={{ 
                display: 'flex',
                flexDirection: 'row'
            }}>
                <CustomSelect
                    style={{ maxWidth: 270 }}
                    variant="outlined"
                    label="Students by Proficiency Rating"
                    name="selection"
                    handleSelect={handleChange}
                    value={selection}
                    options={
                        isAP ?
                            ['All', '1', '2', '3', '4', '5'] :
                            ['All', 'Exceeding Expectations', 'Meeting Expectations', 'Partially Meeting Expectations', 'Not Meeting Expectations']
                    }
                />
                <CustomSelect
                    style={{ maxWidth: 270 }}
                    variant="outlined"
                    label="Select Test"
                    name="test"
                    handleSelect={handleChange}
                    value={test}
                    options={testOptions}
                />
            </div>

            <CustomSpreadSheetTable
                records={display}
                header={header}
                isLoading={isLoading}
            />
        </div>
    )

}

export default SectionTestResults;