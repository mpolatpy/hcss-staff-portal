import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setSubmissionMessage } from '../../redux/observation-form/observation-form.actions';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { firestore } from '../../firebase/firebase.utils';
import { List, Link, ListItem, Typography, CircularProgress, Paper, Divider } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    accordion: {
        boxShadow: 'none',
    }, 
    accordionHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    accordionSummary: {
        borderBottom: 'none',
        boxShadow: '0'
    }
}));


const ImportantLinks = ({currentUser, setSubmissionMessage}) => {
    const classes = useStyles();
    const [links, setLinks] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [favoriteUrls, setFavoriteUrls] = useState([]);

    useEffect(() => {
        const fetchLinks = async () => {
            const linksRef = firestore.doc('links/data');
            const linkSnapshot = await linksRef.get();
            const fetchedLinks = linkSnapshot.exists ? linkSnapshot.data().all : [];

            const links = {};

            for (let link of fetchedLinks){
                if(link.category in links){
                    links[link.category].push(link);
                } else {
                    links[link.category] = [link];
                }
            }
            setLinks(links);
        };

        const fetchFavorites = async () => {
            const ref = firestore.collection(`links/favorites/${currentUser.id}`);
            const snapshot = await ref.get();
            let favorites = [];

            if(!snapshot.empty){
                snapshot.docs.forEach( doc => favorites = [...favorites, doc.data()]);
            }

            setFavorites(favorites);
            setFavoriteUrls(favorites.map(fav => fav.url));
        }

        setIsLoading(true);
        fetchLinks();
        fetchFavorites();
        setIsLoading(false);
    },[]);

    const addToFavorites = async (link) => {
        let message;
        try{
            const ref = firestore.collection(`links/favorites/${currentUser.id}`).doc();
            const updatedLink = {
                ...link,
                ref: ref.id
            };
            await ref.set(updatedLink);

            setFavorites([...favorites, updatedLink]);
            setFavoriteUrls([...favoriteUrls, updatedLink.url]);

            message = {
                content: 'Successfully added link to the favorites',
                status: 'success'
            };
        } catch (e) {
            message = {
                content: e.message,
                status: 'error'
            };
        }
        setSubmissionMessage(message);
    };

    const removeFromFavorites = async (linkRef) => {
        let message;
        try{
            const ref = firestore.doc(`links/favorites/${currentUser.id}/${linkRef}`);
            await ref.delete();

            const updatedFavorites = favorites.filter(link => link.ref !== linkRef);

            setFavorites(updatedFavorites);
            setFavoriteUrls(updatedFavorites.map(fav => fav.url));

            message = {
                content: 'Successfully removed link from the favorites',
                status: 'success'
            };
        } catch (e) {
            message = {
                content: e.message,
                status: 'error'
            };
        }
        setSubmissionMessage(message);
    };

    return ( 
        <div>
            {
            isLoading ? 
            ( 
                <CircularProgress />
            ) : 
            (
            <div>
                <div>
                <Paper variant="outlined" style={{ padding: '18px', marginBottom: '10px'}}>
                    <Typography variant="h5">Favorites</Typography>
                    <Divider/>
                {favorites.length ? ( 
                    <List>
                    {
                        favorites.map((link, i) => ( 
                            <ListItem key={`favorites-${i}`}>
                                <Link href={link.url} variant="subtitle1" target="_blank" rel="noopener">
                                    {link.label}
                                </Link>
                                <Tooltip title="Remove From Favorites">
                                    <IconButton style={{marginLeft:'10px'}} size="small" onClick={() => removeFromFavorites(link.ref)} aria-label={`add-to-favorites-${i}`}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        ))
                    }
                    </List>
                
                 ): (
                     <Typography style={{marginTop: '10px'}}>You can add links to your favorites by clicking the star next to each link.</Typography>
                 )}
                 </Paper>
            </div>
            
            <div>
                {/* {links && Object.keys(links).sort().map((item) => (
                <Paper key={item} variant="outlined" style={{ padding: '18px', marginBottom: '10px'}}>
                    <Typography variant="h5">{item}</Typography>
                    <Divider/>
                    <List>
                    {
                        links[item].map((link, i) => ( 
                            <ListItem key={`${item}-${i}`}>
                                <Link href={link.url} variant="subtitle1" target="_blank" rel="noopener">
                                    {link.label}
                                </Link>
                                <Tooltip title="Add to Favorites">
                                    <IconButton onClick={() => addToFavorites(link)} aria-label={`add-to-favorites-${item}-${i}`}>
                                        <StarBorderIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        ))
                    }
                    </List>
                </Paper>   
                ))} */}
                {
                    links && Object.keys(links).sort().map((item) => (
                        <div className={classes.root}>
                            <Accordion className={classes.accordion}>
                                <AccordionSummary
                                    className={classes.accordionSummary}
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-label="Expand"
                                    aria-controls="additional-actions1-content"
                                    id={`action-header-for-${item}`}
                                >
                                    <div className={classes.accordionHeader}>
                                        <Typography variant="h6">{item}</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails >
                                <List>
                                {
                                    links[item].map((link, i) => ( 
                                        <ListItem key={i}>
                                            <Link href={link.url} variant="subtitle1" target="_blank" rel="noopener">
                                                {link.label}
                                            </Link>
                                            {
                                                favoriteUrls.includes( link.url ) ?
                                                (
                                                    <Tooltip title="Already in Favorites">
                                                        <IconButton style={{marginLeft:'10px'}} size="small" aria-label={`add-to-favorites-${item}-${i}`}>
                                                            <StarIcon color="primary" fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                <Tooltip title="Add to Favorites">
                                                    <IconButton style={{marginLeft:'10px'}} size="small" onClick={() => addToFavorites(link)} aria-label={`add-to-favorites-${item}-${i}`}>
                                                        <StarBorderIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                )
                                            }
                                        </ListItem>
                                    ))
                                }
                                </List>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    ))
                }
            </div>
            </div>
            )}
        </div>
    );

}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    setSubmissionMessage: (message) => dispatch(setSubmissionMessage(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(ImportantLinks);