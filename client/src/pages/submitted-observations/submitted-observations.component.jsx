import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from '../../redux/school-year/school-year.selectors';

import SubmittedObservationsTable from '../../components/submitted-observations-table/submitted-observations-table.component';
import SubmittedObservationsChart from '../../components/submitted-observations-chart/submitted-observations-chart.component';
import { Typography } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class SubmittedObservationsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            observations: [],
            showTable: false
        };
    }

    componentDidMount() {
        const { currentUser, currentYear } = this.props;

        let observationData = [];
        firestore.collection(`observationCounts/${currentYear}/${currentUser.id}`)
                .get()
                .then( snapshot => { 
                    snapshot.forEach( doc => observationData = [...observationData, doc.data()] )
                })
                .then( () => this.setState({observations: observationData}))
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
    }

    handleToggle = () => {
        this.setState({showTable: !this.state.showTable})
    }

    render() {
        const { classes, match } = this.props;
        return ( 
            <div>
                <Typography variant="h5">Submitted Observations</Typography>
                <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <FormControlLabel
                        control={<Switch checked={this.state.showTable} onChange={this.handleToggle} color="primary" name="toggleShowNumbers" />}
                        label={this.state.showTable ? 'Switch to Graph View' : 'Switch to Table View'}
                    />
                </div>
                {
                    this.state.showTable ? 
                    (
                        <SubmittedObservationsTable 
                            observations={this.state.observations}
                            baseUrl={match.path}
                        />
                    ):( 
                        <SubmittedObservationsChart observations={this.state.observations} />
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear
});

export default connect(mapStateToProps)(SubmittedObservationsPage);