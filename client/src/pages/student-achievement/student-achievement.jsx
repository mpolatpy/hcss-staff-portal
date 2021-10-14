import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import { selectTeacherOptions, selectTeachersObjWithNameKeys } from "../../redux/teachers/teachers.selectors";
import CustomSelect from '../../components/custom-select/custom-select.component';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import StudentAchievementBar from './achievement-chart';
import SpreadSheetTable from '../../components/spreadsheet-table/spreadsheet-table';
import DoughnutChart from './doughnut-chart';
import CircularProgress from '@material-ui/core/CircularProgress';

const StudentAchievementPage = ({ filterProperty, spreadsheetData, isLoading, header, currentUser, currentYear, teachersOptions, teachersMap }) => {
    const [teacher, setTeacher] = useState(currentUser);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const key = currentUser[filterProperty];

        if(spreadsheetData && (key in spreadsheetData)){
            setRecords(spreadsheetData[key])
        }
    }, [currentUser, filterProperty, spreadsheetData]);

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
    teachersOptions: selectTeacherOptions,
    teachersMap: selectTeachersObjWithNameKeys,
});

export default connect(mapStateToProps)(StudentAchievementPage);
