import SimpleTabs from '../tab-panels/tabs.component';
import Button from '@material-ui/core/Button';
import ObservationItemTable from '../observation-item-table/observation-item-table.component';
import PreviousObservationsTable from './previous-observations-table';

const CustomAccordionContent = (props) => {
    const { name, domainName, observationItem, previousObservations, handleReset, readOnly, currentUser } = props;

    const labels = ['Rubric'];
    const contents = [(<ObservationItemTable observationItem={observationItem} />)];

    if (!!currentUser && !readOnly && (currentUser.role === 'dci' || currentUser.role === 'superadmin')) {
        labels.push('Previous Observations');
        contents.push(
            <PreviousObservationsTable
                observations={previousObservations}
                domainName={domainName}
                item={name}
            />
        )
    }

    if (!readOnly) {
        labels.push('Reset');
        contents.push(
            <Button
                aria-label="undo"
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleReset(name)}
            >
                Reset Rating
            </Button>
        );
    }

    return (
        <SimpleTabs
            labels={labels}
            contents={contents}
        />
    )
}

export default CustomAccordionContent;