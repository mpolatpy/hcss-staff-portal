import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import CustomSelect from '../../components/custom-select/custom-select.component';
import SimpleTabs from '../../components/tab-panels/tabs.component';
// import SpreadSheetTable from '../../components/spreadsheet-table/spreadsheet-table';
import CustomSpreadSheetTable from '../../components/spreadsheet-table/custom-spreadsheet-table';
import { getSpreadSheetData, mapSpreadsheetData, mapRow } from '../../components/spreadsheet-table/spreadsheet-table.utils';
import { selectTeacherOptions, selectTeachersObjWithNameKeys } from '../../redux/teachers/teachers.selectors';

const TutoringPage = ({ currentUser, currentYear, teachers, teachersMap }) => {
    const labels = ['Summary', 'Tutoring Counts by Students', 'Tutoring Records'];
    const [teacher, setTeacher] = useState(currentUser);
    const [header, setHeader] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false)
    const [allRecords, setAllRecords] = useState({});
    const [filterProperty, setFilterProperty] = useState(null);
    const [tutoringCounts, setTutoringCounts] = useState(null);
    const [tutoringTypeCounts, setTypeTutoringCounts] = useState(null);

    useEffect(() => {
        const fetchTutoringData = async () => {
            const spreadSheetInfoRef = `googleSheets/tutoring/${currentYear}/hcss`;
            setLoading(true);

            if (currentUser) {
                const allData = await getSpreadSheetData(spreadSheetInfoRef);

                if (allData) {
                    const { data, spreadSheetInfo } = allData;
                    const { columns, filterColumn, filterProperty } = spreadSheetInfo;
                    const allRecords = mapSpreadsheetData(data, columns, filterColumn);
                    console.log(allRecords, currentUser[filterProperty]);
                    setAllRecords(allRecords);
                    setFilterProperty(filterProperty);
                    setHeader(mapRow(data[0], columns));
                    const records = allRecords[currentUser[filterProperty]];
                    setRecords(records);
                    if (records) {
                        const { tutoringTypeCounts, tutoringCounts } = getStudentTutoringCounts(records);
                        setTutoringCounts(tutoringCounts);
                        setTypeTutoringCounts(tutoringTypeCounts);
                    }
                }
            }

            setLoading(false);
        };

        fetchTutoringData();

    }, [currentYear, currentUser]);

    const handleSelect = (e) => {
        const { value } = e.target;
        const teacher = teachersMap[value];
        setTeacher(teacher);
        const records = allRecords[teacher[filterProperty]]
        setRecords(records);
        if (records) {
            const { tutoringTypeCounts, tutoringCounts } = getStudentTutoringCounts(records);
            setTutoringCounts(tutoringCounts);
            setTypeTutoringCounts(tutoringTypeCounts);
        }

    };

    const getStudentTutoringCounts = (records) => {
        const tutoringCounts = {};
        const tutoringTypeCounts = { 'A.S.': 0, 'O.H.': 0, 'S.H.': 0, 'Sat': 0 };

        records.forEach(record => {
            tutoringTypeCounts[record[4]] = (tutoringTypeCounts[record[4]] || 0) + 1; //Column for Tutoring Type
            record.slice(1, 4).forEach(student => {
                if (student !== '') {
                    tutoringCounts[student] = (tutoringCounts[student] || 0) + 1;
                }
            })
        });

        return { tutoringTypeCounts, tutoringCounts };
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
                <Typography variant="h5">Tutoring Records</Typography>
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
                records && records.length ? (
                    <SimpleTabs
                        labels={labels}
                        contents={[
                            (
                                <>
                                    <div style={{ width: '30vw', marginTop: '20px' }}>
                                        <CustomSpreadSheetTable
                                            records={
                                                tutoringTypeCounts && Object.keys(tutoringTypeCounts)
                                                    .sort()
                                                    .map(type => ([type, tutoringTypeCounts[type]]))
                                            }
                                            header={['Tutoring Type', '# of Tutoring']}
                                            isLoading={loading}
                                            // size="small"
                                            // maxHeight="600px"
                                        />
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <div>
                                            <Typography variant="caption">
                                                # of tutoring sessions: {(records && records.length) || 0}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="caption">
                                                # of students tutored: {(tutoringCounts && Object.keys(tutoringCounts).length) || 0}
                                            </Typography>
                                        </div>
                                    </div>
                                </>

                            ), (
                                <div style={{ width: '30vw', marginTop: '20px 20px 20px' }}>
                                    <CustomSpreadSheetTable
                                        records={
                                            tutoringCounts && Object.keys(tutoringCounts)
                                                .sort()
                                                .map(student => ([student, tutoringCounts[student]]))
                                        }
                                        header={['Student Name', '# of Tutoring']}
                                        isLoading={loading}
                                        // size="small"
                                        // maxHeight="600px"
                                    />
                                </div>

                            ), (
                                <CustomSpreadSheetTable
                                    records={records}
                                    header={header}
                                    isLoading={loading}
                                    // size="small"
                                    // maxHeight="600px"
                                />
                            )
                        ]
                        }
                    />
                ) : null
            }
            {/* {
                records && records.length ? (
                    // <SpreadSheetTable
                    //     spreadSheetInfoRef={`googleSheets/tutoring/${currentYear}/hcss`}
                    //     currentUser={teacher}
                    // />
                    <div>
                        {
                            tutoringCounts && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                    }}
                                >
                                    <div style={{ width: '30vw', marginTop: '20px 20px 20px' }}>
                                        <CustomSpreadSheetTable
                                            records={
                                                Object.keys(tutoringCounts)
                                                    .sort()
                                                    .map(student => ([student, tutoringCounts[student]]))
                                            }
                                            header={['Student Name', '# of Tutoring']}
                                            isLoading={loading}
                                            // size="small"
                                            maxHeight="600px"
                                        />
                                    </div>
                                    <div style={{ width: '30vw', marginTop: '20px' }}>
                                        <CustomSpreadSheetTable
                                            records={
                                                Object.keys(tutoringTypeCounts)
                                                    .sort()
                                                    .map(type => ([type, tutoringTypeCounts[type]]))
                                            }
                                            header={['Tutoring Type', '# of Tutoring']}
                                            isLoading={loading}
                                            // size="small"
                                            maxHeight="600px"
                                        />
                                        <div style={{ marginTop: '20px' }}>
                                            <Typography ># of tutoring sessions:
                                                {(records && records.length) || 0}
                                            </Typography>
                                            <Typography ># of students tutored:
                                                {(tutoringCounts && Object.keys(tutoringCounts).length) || 0}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <CustomSpreadSheetTable
                            records={records}
                            header={header}
                            isLoading={loading}
                            // size="small"
                            maxHeight="600px"
                        />
                    </div>
                ) : null
            } */}
        </div >
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    teachersMap: selectTeachersObjWithNameKeys,
    teachers: selectTeacherOptions
});

export default connect(mapStateToProps)(TutoringPage);
