import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import CustomSelect from '../../components/custom-select/custom-select.component';
import { fetchSpreadSheetData } from '../../components/spreadsheet-table/spreadsheet-table.utils';
import SimpleTabs from '../../components/tab-panels/tabs.component';
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import { selectTeacherOptions, selectTeachersObjWithNameKeys } from '../../redux/teachers/teachers.selectors';
import CircularProgress from '@material-ui/core/CircularProgress';

const TestResultsPage = ({ currentUser, currentYear, teachers, teachersMap }) => {
    // const school = currentUser.school === 'HCSS West' ? 'west' : 'east';

    const [teacher, setTeacher] = useState(currentUser);
    const [records, setRecords] = useState([]);
    const [header, setHeader] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [resultsMap, setResultsMap] = useState(null);

    useEffect(() => {
        const spreadSheetInfoRef = `googleSheets/testResults/${currentYear}/finals`;

        const fetchData = async () => {
            const { records, header } = await fetchSpreadSheetData(
                spreadSheetInfoRef,
                teacher,
                setLoading,
                setHeader,
                setRecords
            );

            const index = header.indexOf('Class');
            const resultsMap = {};

            for (let record of records) {
                const section = record[index]
                if (section in resultsMap) {
                    resultsMap[section] = [...resultsMap[section], record];
                } else {
                    resultsMap[section] = [record];
                }
            }

            setResultsMap(resultsMap);
        }

        fetchData();
    }, [currentYear, teacher]);

    const handleSelect = (e) => {
        const { value } = e.target;
        setTeacher(teachersMap[value]);
    };

    if(isLoading){
        return (
            <CircularProgress />
        );
    }

    return (
        <div>
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px 0 20px'
                }}
            >
                <Typography variant="h5">Test Results</Typography>
                {
                    currentUser && currentUser.role !== 'teacher' && (
                        <CustomSelect
                            label="Selected Teacher"
                            style={{ width: 100, height: 40 }}
                            options={teachers}
                            name="selectTeacher"
                            value={`${teacher.lastName}, ${teacher.firstName}`}
                            handleSelect={handleSelect}
                        />
                    )
                }
            </Box>
            {
                teacher && resultsMap && (
                    <SimpleTabs
                        labels={Object.keys(resultsMap).sort()}
                        contents={
                            Object.keys(resultsMap)
                                .sort()
                                .map(
                                    section => (
                                        <CustomSpreadSheetTable
                                            key={section}
                                            records={resultsMap[section]}
                                            header={header}
                                            isLoading={isLoading}
                                        />
                                    )
                                )
                        }
                    />
                )
            }
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    teachersMap: selectTeachersObjWithNameKeys,
    teachers: selectTeacherOptions
});

export default connect(mapStateToProps)(TestResultsPage);