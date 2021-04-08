import { createSelector } from 'reselect';

export const selectLessonPlans = state => state.lessonPlans;

export const selectTeachersForLPCheck = createSelector(
    [selectLessonPlans], lessonPlans => lessonPlans.teachers
);

export const selectIsLessonPlanChecksLoading = createSelector(
    [selectLessonPlans], lessonPlans => lessonPlans.isLoading
);

export const selectLessonPlansErrorMessage = createSelector(
    [selectLessonPlans], lessonPlans => lessonPlans.errorMessage
);