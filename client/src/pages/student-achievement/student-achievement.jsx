import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import { fetchSpreadSheetData } from '../../components/spreadsheet-table/spreadsheet-table.utils';
import { selectTeacherOptions, selectTeachersObjWithNameKeys } from "../../redux/teachers/teachers.selectors";
import CustomSelect from '../../components/custom-select/custom-select.component';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import StudentAchievementBar from './achievement-chart';
import SpreadSheetTable from '../../components/spreadsheet-table/spreadsheet-table';

const StudentAchievementPage = ({ currentYear, currentUser, teachersOptions, teachersMap }) => {
    const [teacher, setTeacher] = useState(currentUser);
    const [records, setRecords] = useState([]);
    const [header, setHeader] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const spreadSheetInfoRef = `googleSheets/studentAchievement/${currentYear}/data`;

        fetchSpreadSheetData(
            spreadSheetInfoRef,
            teacher,
            setLoading,
            setHeader,
            setRecords
        );
    }, [currentYear, teacher]);

    const handleSelect = (e) => {
        const { value } = e.target;
        const teacher = teachersMap[value];
        setTeacher(teacher)
    };

    return (
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
                spreadSheetInfoRef = {`googleSheets/studentAchievement/${currentYear}/teacherTarget`}
                currentUser = {teacher}
            />
            {records.length ? (
                <div style={{ marginTop: '10px' }}>
                    <StudentAchievementBar
                        records={records}
                        header={header}
                    />
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
    );
};

const mapStateToProps = createStructuredSelector({
    currentYear: selectCurrentYear,
    currentUser: selectCurrentUser,
    teachersOptions: selectTeacherOptions,
    teachersMap: selectTeachersObjWithNameKeys,
});

export default connect(mapStateToProps)(StudentAchievementPage);
