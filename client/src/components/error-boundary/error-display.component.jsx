import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    errorImageOverlay: {
        height: '60vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorImageContainer: {
        display: 'inline-block',
        backgroundImage: `url(https://i.imgur.com/yW2W9SC.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '40vh',
        height: '40vh'
    },
    errorImageText: {
        fontSize: '28px',
        color: '#2f8e89',
    }
});

const ErrorDisplay = () => {
    const styles = useStyles();
    return (
        <div className={styles.errorImageOverlay}>
            <div className={styles.errorImageContainer} />
            <h2 className={styles.errorImageText}>Something went wrong</h2>
        </div>
    )
};

export default ErrorDisplay;