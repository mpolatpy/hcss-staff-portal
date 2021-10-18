import { useState, useEffect } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { getSpreadSheetData, mapSpreadsheetData, mapRow } from '../../components/spreadsheet-table/spreadsheet-table.utils';
import StudentAchievementPage from './student-achievement';
import StudentAchievementReports from './student-achievement.reports';

const StudentAchievement = ({ match, currentYear, currentUser }) => {
    const [spreadsheetData, setSpreadsheetData] = useState(null);
    const [filterProperty, setFilterProperty] = useState('');
    const [header, setHeader] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [rawData, setRawData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const spreadSheetInfoRef = `googleSheets/studentAchievement/${currentYear}/data`;
            const spreadsheetData = await getSpreadSheetData(spreadSheetInfoRef);

            if (!spreadsheetData) {
                setLoading(false);
                return;
            }

            const { data, spreadSheetInfo } = spreadsheetData;
            const { columns, filterColumn, filterProperty } = spreadSheetInfo;
            const mappedData = mapSpreadsheetData(data, columns, filterColumn);
            setRawData(data);
            setHeader(mapRow(data[0], columns));
            setFilterProperty(filterProperty);
            setSpreadsheetData(mappedData);
            setLoading(false);
        }

        fetchData();
    }, [currentYear]);


    return (
        <>
            <Route exact path={match.path}>
                {
                    currentUser.role === 'teacher' ? (
                        <Redirect to={`${match.path}/teacher`} />
                    ) : (
                        <StudentAchievementReports
                            currentUser={currentUser}
                            isLoading={isLoading}
                            data={rawData}
                            match={match}
                        />
                    )
                }
            </Route>
            {/* <Route exact path={match.path} render={() =>
                <StudentAchievementPage
                    filterProperty={filterProperty}
                    spreadsheetData={spreadsheetData}
                    header={header}
                    isLoading={isLoading}
                    currentUser={currentUser}
                    currentYear={currentYear}
                />
            } /> */}
            <Route exact path={`${match.path}/teacher`}
                render={() =>
                    <StudentAchievementPage
                        filterProperty={filterProperty}
                        spreadsheetData={spreadsheetData}
                        header={header}
                        isLoading={isLoading}
                        currentUser={currentUser}
                        currentYear={currentYear}
                    />
                }
            />
        </>
    );
};

const mapStateToProps = createStructuredSelector({
    currentYear: selectCurrentYear,
    currentUser: selectCurrentUser
});

export default withRouter(connect(mapStateToProps)(StudentAchievement));