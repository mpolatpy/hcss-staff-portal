import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import axios from "axios";
import Typography from '@material-ui/core/Typography';

const AttendancePage = ({currentUser}) => {
    const [records, setRecords ] = useState([]);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try{
                const response = await axios.post('/read-google-sheets-data', {
                    options: {
                        spreadsheetId: '1kWFDhpp3yJRcDXyIWAXZ9YAr6jb22JTY15vkZsXaMfo',
                        range: 'PowerSchool!A1:B4',
                    }
                });
    
                if(response.data && response.data.status === 'success'){
                    setRecords(response.data.result)
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchAttendanceData();
    }, []);

    return ( 
    <div>
        <Typography variant="h5">Attendance Page - Under Construction</Typography>
        {/* <div>
        {
            records.map( (record, i) => (
                <Typography key={i}>{record[0]}</Typography>    
            ))
        }
        </div> */}
        <button onClick={() => console.log(records)}>View Data</button>
    </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(AttendancePage);