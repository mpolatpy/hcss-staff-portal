import { createSelector } from 'reselect';

export const selectGradePolicyChecks = state => state.gradePolicy;

export const selectTeachersForGradeCheck = createSelector(
    [selectGradePolicyChecks], gradePolicy => gradePolicy.teachers
);

export const selectGradeChecks = createSelector(
    [selectGradePolicyChecks], gradePolicy => gradePolicy.gradePolicyChecks
);

export const selectIsGradePolicyCheckLoading = createSelector(
    [selectGradePolicyChecks], gradePolicy => gradePolicy.isLoading
);

export const selectLessonPlansErrorMessage = createSelector(
    [selectGradePolicyChecks], gradePolicy => gradePolicy.errorMessage
);