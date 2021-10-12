import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import { getSpreadSheetData, mapSpreadsheetData, mapRow } from '../../components/spreadsheet-table/spreadsheet-table.utils';
import { selectTeacherOptions, selectTeachersObjWithNameKeys } from "../../redux/teachers/teachers.selectors";
import CustomSelect from '../../components/custom-select/custom-select.component';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import StudentAchievementBar from './achievement-chart';
import SpreadSheetTable from '../../components/spreadsheet-table/spreadsheet-table';
import DoughnutChart from './doughnut-chart';
import CircularProgress from '@material-ui/core/CircularProgress';

const StudentAchievementPage = ({ currentYear, currentUser, teachersOptions, teachersMap }) => {
    const [teacher, setTeacher] = useState(currentUser);
    const [spreadsheetData, setSpreadsheetData] = useState(null);
    const [filterProperty, setFilterProperty] = useState('');
    const [records, setRecords] = useState([]);
    const [header, setHeader] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const spreadSheetInfoRef = `googleSheets/studentAchievement/${currentYear}/data`;
            const spreadsheetData = await getSpreadSheetData(spreadSheetInfoRef);

            if (!spreadsheetData) {
                setLoading(false);
                return;
            }

            const { data, spreadSheetInfo } = spreadsheetData;
            const { columns, filterColumn, filterProperty } = spreadSheetInfo;
            const mappedData = mapSpreadsheetData(data, columns, filterColumn);
            const key = currentUser[filterProperty];

            if (key in mappedData) setRecords(mappedData[key]);
            setHeader(mapRow(data[0], columns));
            setFilterProperty(filterProperty);
            setSpreadsheetData(mappedData);
            setLoading(false);
        }

        fetchData();
    }, [currentYear]);

    const handleSelect = (e) => {
        const { value } = e.target;
        const teacher = teachersMap[value];
        setTeacher(teacher);
        const key = teacher[filterProperty];

        if (key in spreadsheetData) {
            setRecords(spreadsheetData[key]);
        } else {
            setRecords([]);
        }

    };

    return (

        isLoading ?
        (<CircularProgress />) :
        (
            <div>
                <Box
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography variant="h5">Student Achievement</Typography>
                    {
                        currentUser && currentUser.role !== 'teacher' && (
                            <CustomSelect
                                label="Selected Teacher"
                                style={{ width: 100, height: 40 }}
                                options={teachersOptions}
                                name="selectTeacher"
                                value={`${teacher.lastName}, ${teacher.firstName}`}
                                handleSelect={handleSelect}
                            />
                        )
                    }
                </Box>
                <SpreadSheetTable
                    spreadSheetInfoRef={`googleSheets/studentAchievement/${currentYear}/teacherTarget`}
                    currentUser={teacher}
                />
                {records.length ? (
                    <div style={{ margin: '10px' }}>
                        <div style={{ marginBottom: '45px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StudentAchievementBar
                                records={records}
                                header={header}
                            />
                            <span style={{ textAlign: 'center' }}>
                                <h3>SLG Target Ratings % Distribution</h3>
                                {/* <hr/> */}
                                <DoughnutChart
                                    records={records}
                                    header={header}
                                />
                            </span>
                        </div>

                        <CustomSpreadSheetTable
                            // size="small"
                            records={records}
                            header={header}
                            isLoading={isLoading}
                            maxHeight={550}
                        />
                    </div>
                ) : null
                }
            </div>
        )        
    );
};

const mapStateToProps = createStructuredSelector({
    currentYear: selectCurrentYear,
    currentUser: selectCurrentUser,
    teachersOptions: selectTeacherOptions,
    teachersMap: selectTeachersObjWithNameKeys,
});

export default connect(mapStateToProps)(StudentAchievementPage);
