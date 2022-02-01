import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectTeachersObjWithNameKeys } from "../../redux/teachers/teachers.selectors";
import { mapRawData } from './student-achievement-utils';
import CustomSelect from '../../components/custom-select/custom-select.component';
import DoughnutChart from '../../components/charts/doughnut-chart';
import BarChart from '../../components/charts/bar-chart';
import Spinner from '../../components/with-spinner/spinner-component';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const StudentAchievementReports = ({ currentUser, data, isLoading, teachersMap, match }) => {
    const schools = ['HCSS East', 'HCSS West'];
    const departments = ['ELA', 'Math', 'Science', 'Humanities', 'Special Services'];
    const gradeLevels = ['6', '7', '8', '9', '10', '11', '12'];
    const targetRatings = ['E', 'M', 'PM', 'NM'];
    const [report, setReport] = useState(null);
    const [selections, setSelections] = useState({
        school: currentUser.school === 'Central Office' ? 'HCSS East' : currentUser.school,
        department: departments.includes(currentUser.department) ? currentUser.department : 'ELA',
    });

    useEffect(() => {
        const mappedData = mapRawData(data, teachersMap, schools, departments, gradeLevels, targetRatings);
        setReport(mappedData);
    }, [data]);

    const handleSelect = (e) => {
        const { name, value } = e.target;
        setSelections({
            ...selections,
            [name]: value
        })
    };

    return (
        isLoading ? (
            <Spinner />
        ) : (
            <div>
                <Typography variant="h5">Student Achievement Report</Typography>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: '20px 0 40px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <CustomSelect
                            label="School"
                            style={{ width: 100, height: 40 }}
                            options={schools}
                            name="school"
                            variant="outlined"
                            value={selections.school}
                            handleSelect={handleSelect}
                        />
                        <CustomSelect
                            label="Department"
                            style={{ width: 100, height: 40 }}
                            options={departments}
                            name="department"
                            variant="outlined"
                            value={selections.department}
                            handleSelect={handleSelect}
                        />
                    </div>
                    <Button
                        component={Link}
                        to={`${match.path}/teacher`}
                        color="primary"
                    >
                        View Report by Teacher
                    </Button>
                </Box>
                <div>
                    {
                        report && gradeLevels.map(grade => {
                            const gradeData = report[selections.school][selections.department][grade];
                            const { valueCounts, total } = gradeData;

                            return (
                                valueCounts !== 0 ? (
                                    <div key={grade}>
                                        <Typography variant="h6">{`Grade ${grade}`}</Typography>
                                        <hr />
                                        <Typography variant="caption">{`# of students: ${valueCounts} `}</Typography>
                                        <div>
                                            <Typography variant="caption">{`Average Score: ${(total / valueCounts).toFixed(1)}`}</Typography>
                                        </div>
                                        <div style={{ margin: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <BarChart
                                                data={gradeData}
                                            />
                                            <span style={{ textAlign: 'center' }}>
                                                <h3>SLG Target Ratings % Distribution</h3>
                                                <DoughnutChart
                                                    data={gradeData}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                ) : null
                            )
                        })
                    }

                </div>
            </div>
        )
    );
};

const mapStateToProps = createStructuredSelector({
    teachersMap: selectTeachersObjWithNameKeys,
});

export default connect(mapStateToProps)(StudentAchievementReports);