import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeachersForLPCheck, selectIsLessonPlanChecksLoading } from '../../redux/lesson-plans/lesson-plan.selectors';
import { setLessonPlans, submitLessonPlanCheck, resetLessonPlanChecks } from '../../redux/lesson-plans/lesson-plan.actions';
import Content from '../../components/lesson-plan-content/lesson-plan-content.component';
import VerticalTabs from '../../components/vertical-tabs/vertical-tabs-component';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';

const LessonPlanCheckPage = ({ currentUser, currentYear, selectedTeachers, isLoading,
    setLessonPlans, resetLessonPlans, submitLessonPlanCheck }) => {


    const labels = selectedTeachers.length > 0 ?  
                    selectedTeachers.map( 
                        teacher =>  `${teacher.lastName} ${teacher.firstName}`
                    )
                    : [] ;

    const contents = selectedTeachers.length > 0 ?
                        selectedTeachers.map( 
                            (teacher, index) => ( 
                                <Content 
                                    key={index} 
                                    teacher={teacher}
                                    observer={currentUser}
                                    teachers={selectedTeachers}
                                    currentYear={currentYear} 
                                    submitLessonPlanCheck={submitLessonPlanCheck}
                                />
                            )
                        )
                        : []

    return ( 
        <div>
            <div>
            {
                isLoading? (
                    <div>
                        <CircularProgress />
                    </div>
                ): (
                selectedTeachers.length > 0 ?
                (
                    <>
                    <VerticalTabs labels={labels} contents={contents}/>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent:'flex-end'}}>
                        <Button color="secondary" onClick={() => resetLessonPlans()}>
                            <SettingsBackupRestoreIcon/>
                            Clear
                        </Button>
                    </div>
                    </>
                ):( 
                    <div>
                        <h2>No saved lesson plan checks. Create Lesson Plan Checks For Selected Teachers</h2>
                        <div>
                        <Button color="primary" variant="contained" onClick={() => setLessonPlans(currentUser.id)}>Create</Button>
                        <Button color="primary" component={Link} to="/observations/templates/edit">Update Selected Teachers</Button>
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
    selectedTeachers: selectTeachersForLPCheck,
    currentYear: selectCurrentYear, 
    isLoading: selectIsLessonPlanChecksLoading
});

const mapDispatchToProps = dispatch => ({
    setLessonPlans: (currentUserId) => dispatch(setLessonPlans(currentUserId)),
    resetLessonPlans: () => dispatch(resetLessonPlanChecks()),
    submitLessonPlanCheck: (lessonPlan, year, teachers ) => dispatch(submitLessonPlanCheck(lessonPlan, year, teachers))
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonPlanCheckPage);

