import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';

import SimpleTabs from '../../components/tab-panels/tabs.component'; 
import SpreadSheetTable from '../../components/spreadsheet-table/spreadsheet-table';

const AttendancePage = ({currentUser, currentYear}) => {
    const school = currentUser.school === 'HCSS West' ? 'west' : 'east';
    const labels = ['Attendance Summary', 'Attendance Recors', 'Leave Requests'];
    const docs = ['staffAttendance', 'staffAttendanceDetails', 'leaveRequests'];

    return ( 
        <div>
            <SimpleTabs
            labels={labels}
            contents={ docs.map((doc, i) => (
                        <SpreadSheetTable 
                        key={`table-${i}`} 
                        spreadSheetInfoRef={`googleSheets/${doc}/${currentYear}/${school}`} 
                        currentUser={currentUser}
                        />
                        ))
                    }
            />
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
});

export default connect(mapStateToProps)(AttendancePage);