import {useState} from 'react';
import { firestore } from '../../firebase/firebase.utils';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomSelect from '../custom-select/custom-select.component';
import useStyles from "./register-link.styles";

const RegisterLinkForm = ({ categories, links, setSubmissionMessage, currentUser }) => {
    const classes = useStyles(); 

    const [link, setLink] = useState({
        category: '',
        url: '',
        label: '',
        school: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setLink({
            ...link,
            [name]: value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        let message;

        try {
            // const updatedLinks = [link, ...links];
            // const ref = firestore.doc('links/data');
            // await ref.set({all: updatedLinks});

            const ref = firestore.collection('links/data/savedLinks').doc();
            await ref.set(link);

            message = {
                content: 'Successfully saved link.',
                status: 'success'
            };

            setLink({
                category: '',
                url: '',
                label: '',
                school: ''
            });
        } catch (e) {
            message = {
                content: e.message,
                status: 'error'
            };
        } finally {
            setIsLoading(false);
        }

        setSubmissionMessage(message);
    };

    const options = [
        'HCSS East',
        'HCSS West',
        'ELA',
        'Math',
        'Science',
        'Humanities',
        'Special Services',
        'District - All',
        'Central Office',
    ];

    // const addLinksToCollection = () => {
    //     links.forEach(async (link) => {
    //         const ref = firestore.collection('links/data/savedLinks').doc();
    //         await ref.set(link);
    //     });
    // }

    return ( 
        <div>
        {   isLoading ?
            ( <CircularProgress /> ) :
            (
                <div className={classes.root}>
                <form className={classes.inputContainer} onSubmit={handleSubmit}>
                    <div style={{ marginLeft: '10px', marginBottom: '20px'}}>
                        <Typography align="justify" variant="h5" mb={5} ml={1}><strong>Add New Link</strong></Typography>
                    </div>
                    <TextField
                        required
                        className={classes.textInput}
                        onChange={handleChange}
                        value={link.url}
                        type="text"
                        name="url"
                        label="URL"
                        variant="outlined"
                    />
                    <TextField
                        required
                        className={classes.textInput}
                        onChange={handleChange}
                        value={link.label}
                        type="text"
                        name="label"
                        label="Label"
                        variant="outlined"
                    />
                    <CustomSelect
                        required
                        label="Category"
                        name="category"
                        value={link.category}
                        handleSelect={handleChange}
                        options={categories}
                        variant="outlined"
                    />
                    <CustomSelect
                        required
                        label="Group"
                        name="school"
                        value={link.school}
                        handleSelect={handleChange}
                        options={currentUser.role === 'superadmin' ? [...options, 'SuperAdmin Only'] :options}
                        variant="outlined"
                    />
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                        >
                            Save
                    </Button>
                </form>
        </div>
        )}
        </div>
    );
} 

export default RegisterLinkForm;