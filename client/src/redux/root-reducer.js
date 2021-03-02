import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import teachersReducer from './teachers/teachers.reducer';
import observationFormReducer from './observation-form/observation-form.reducer';
import yearReducer from './school-year/school-year.reducer';
import savedObservationsReducer from './saved-observations/saved-observations.reducer';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [teachersReducer]
};

const rootReducer = combineReducers({
    user: userReducer,
    teachers: teachersReducer,
    observationForm: observationFormReducer,
    schoolYear: yearReducer,
    savedObservations: savedObservationsReducer,
});

export default persistReducer(persistConfig, rootReducer);