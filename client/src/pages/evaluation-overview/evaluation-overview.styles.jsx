import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiDataGrid-columnsContainer': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText
        },
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(0)
    },
    selectOptions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    wrappedCell: {
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    }
}));

