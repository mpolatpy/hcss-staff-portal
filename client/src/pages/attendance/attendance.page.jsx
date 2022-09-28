import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import CustomSelect from '../../components/custom-select/custom-select.component';
import SimpleTabs from '../../components/tab-panels/tabs.component';
import SpreadSheetTable from '../../components/spreadsheet-table/spreadsheet-table';
import { selectTeacherOptions, selectTeachersObjWithNameKeys } from '../../redux/teachers/teachers.selectors';

const AttendancePage = ({ currentUser, currentYear, teachers, teachersMap }) => {
    const [teacher, setTeacher] = useState(currentUser);
    const labels = ['Attendance Summary', 'Attendance Records', 'Leave Requests'];
    const docs = ['staffAttendance', 'staffAttendanceDetails', 'leaveRequests'];
    const school = teacher.school === 'HCSS West' ? 'west' : 'east';

    const handleSelect = (e) => {
        const { value } = e.target;
        setTeacher(teachersMap[value]);
    };


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
                <Typography variant="h5">Attendance Records</Typography>
                {
                    currentUser && currentUser.role === 'superadmin' && (
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
                teacher && (
                    <SimpleTabs
                        labels={labels}
                        contents={docs.map((doc, i) => (
                            <SpreadSheetTable
                                key={`table-${i}`}
                                spreadSheetInfoRef={`googleSheets/${doc}/${currentYear}/${school}`}
                                currentUser={teacher}
                            />
                        ))
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

export default connect(mapStateToProps)(AttendancePage);