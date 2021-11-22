import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';
import { selectTeacherList } from '../../redux/teachers/teachers.selectors';

import SubmittedObservationsTable from '../../components/submitted-observations-table/submitted-observations-table.component';
import SubmittedObservationsChart from '../../components/submitted-observations-chart/submitted-observations-chart.component';
import CustomSelect from '../../components/custom-select/custom-select.component';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class SubmittedObservationsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            observer: this.props.currentUser,
            observersMap: {},
            observations: [],
            showTable: false,
            observationsByMonth: null
        };
    }

    componentDidMount() {
        const { currentUser, currentYear, teacherList } = this.props;
        this.fetchObservationCounts(currentUser, currentYear);
        this.fetchObservations(currentUser, currentYear);

        const observers = teacherList.filter(staff => staff.role === 'dci' || staff.role === 'admin')
            .reduce((acc, current) => {
                const name = `${current.lastName}, ${current.firstName}`
                acc[name] = current;
                return acc;
            }, {});
        observers[`${currentUser.lastName}, ${currentUser.firstName}`] = currentUser;
        this.setState({ observersMap: observers });
    }

    fetchObservationCounts = (observer, currentYear) => {
        let observationData = [];
        firestore.collection(`observationCounts/${currentYear}/${observer.id}`)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => observationData = [...observationData, doc.data()])
            })
            .then(() => this.setState({ observations: observationData }))
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    fetchObservations = (observer, currentYear) => {
        let observations = { total: 0};

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const ref = firestore.collection(`observations`)
            .where('observationDetails.schoolYear', '==', currentYear)
            .where('observerId', '==', observer.id);

        ref.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    observations.total++;
                    const observation = doc.data();
                    const { observationDetails } = observation;
                    const observationDate = observationDetails.observationDate.toDate();
                    const { teacher } = observationDetails;
                    const teacherName = `${teacher.lastName}, ${teacher.firstName}`;
                    const month = months[observationDate.getMonth()];
                    
                    if (month in observations) {
                        observations[month]['count']++;
                        observations[month]['observationCountByTeacher'][teacherName] = (observations[month]['observationCountByTeacher'][teacherName] || 0) + 1;
                    } else {
                        observations = {
                            ...observations,
                            [month]: {
                                count: 1,
                                observationCountByTeacher: {
                                    [teacherName]: 1
                                }
                            }
                        };
                    }
                })
            })
            .then(() => this.setState({ observationsByMonth: observations }))
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    handleToggle = () => {
        this.setState({ showTable: !this.state.showTable })
    }

    handleSelect = (e) => {
        const { currentYear } = this.props;
        const { value } = e.target;
        if (!(value in this.state.observersMap)) return;

        const observer = this.state.observersMap[value];
        this.fetchObservationCounts(observer, currentYear);
        this.fetchObservations(observer, currentYear);
        this.setState({ observer: observer });
    }

    render() {
        const { match, currentUser } = this.props;
        return (
            <div>
                <Box
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography variant="h5">Submitted Observations</Typography>
                    <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                        <FormControlLabel
                            control={<Switch checked={this.state.showTable} onChange={this.handleToggle} color="primary" name="toggleShowNumbers" />}
                            label={this.state.showTable ? 'Switch to Graph View' : 'Switch to Table View'}
                        />
                        {
                            currentUser && currentUser.role === 'superadmin' && (
                                <CustomSelect
                                    label="Observer"
                                    style={{ width: 30, height: 40 }}
                                    options={Object.keys(this.state.observersMap)}
                                    name="selectObserver"
                                    value={`${this.state.observer.lastName}, ${this.state.observer.firstName}`}
                                    handleSelect={this.handleSelect}
                                />
                            )
                        }
                    </div>
                </Box>
                {/* <Typography variant="h5">Submitted Observations</Typography> */}

                {
                    this.state.showTable ?
                        (
                            <SubmittedObservationsTable
                                observations={this.state.observations}
                                baseUrl={match.path}
                            />
                        ) : (
                            <SubmittedObservationsChart
                                observations={this.state.observations}
                                observationsByMonth={this.state.observationsByMonth}
                            />
                        )
                }
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    teacherList: selectTeacherList
});

export default connect(mapStateToProps)(SubmittedObservationsPage);