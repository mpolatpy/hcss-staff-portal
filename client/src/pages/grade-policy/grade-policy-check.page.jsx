import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeachersForGradeCheck, selectGradeChecks, selectIsGradePolicyCheckLoading } from '../../redux/grade-policy/grade-policy.selectors';
import { setGradePolicyCheck, submitGradePolicyCheck, resetGradePolicyChecks } from '../../redux/grade-policy/grade-policy.actions';
import GradePolicyCheckContent from './grade-policy-check.component';
import VerticalTabs from '../../components/vertical-tabs/vertical-tabs-component';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Typography from '@material-ui/core/Typography';

const GradePolicyCheckPage = ({ currentUser, currentYear, selectedTeachers, isLoading, gradeChecks,
    setGradePolicyCheck, resetGradePolicyChecks, submitGradePolicyCheck }) => {

    const labels = selectedTeachers.length > 0 ?
        selectedTeachers.map(
            teacher => `${teacher.lastName} ${teacher.firstName}`
        )
        : [];

    const contents = selectedTeachers.length > 0 ?
        selectedTeachers.map(
            (teacher, index) => (
                <GradePolicyCheckContent
                    key={index}
                    teacher={teacher}
                    gradePolicyScores = {isLoading ? null : gradeChecks[teacher.lastFirst]}
                    submitGradePolicyCheck={submitGradePolicyCheck}
                    observer={currentUser}
                    currentYear={currentYear}
                    teachers={selectedTeachers}
                />
            )
        )
        : [];

    console.log(gradeChecks);

    return (
        <div>
            <div>
                {
                    isLoading ? (
                        <div>
                            <CircularProgress />
                        </div>
                    ) : (
                        selectedTeachers.length > 0 ?
                            (
                                <>
                                    <VerticalTabs labels={labels} contents={contents} />
                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                                        <Button color="secondary" variant="outlined" onClick={() => resetGradePolicyChecks()}>
                                            <SettingsBackupRestoreIcon />
                                            Clear All
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <Typography variant="h5">Grades/Grade Policy Check</Typography>
                                    <div style={{ marginTop: '20px' }}>
                                        <Typography>Please initialize grade checks for selected teachers. You need to have at least one selected teacher.</Typography>
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <Button color="primary" variant="contained" onClick={() => setGradePolicyCheck(currentUser.id)}>Create</Button>
                                        <Button style={{ marginLeft: '15px' }} color="primary" variant="outlined" component={Link} to="/observations/templates/edit">Update Selected Teachers</Button>
                                    </div>
                                </div>
                            ))
                }
            </div>
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    selectedTeachers: selectTeachersForGradeCheck,
    currentYear: selectCurrentYear,
    isLoading: selectIsGradePolicyCheckLoading,
    gradeChecks: selectGradeChecks
});

const mapDispatchToProps = dispatch => ({
    setGradePolicyCheck: (currentUserId) => dispatch(setGradePolicyCheck(currentUserId)),
    resetGradePolicyChecks: () => dispatch(resetGradePolicyChecks()),
    submitGradePolicyCheck: (lessonPlan, year, teachers) => dispatch(submitGradePolicyCheck(lessonPlan, year, teachers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GradePolicyCheckPage);

