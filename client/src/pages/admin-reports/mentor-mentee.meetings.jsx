import { useEffect, useState } from 'react';
import { firestore } from '../../firebase/firebase.utils';

const MentorMeetings = ({ currentYear }) => {
    const [meetings, setMeetings] = useState(null);

    useEffect(() => {
        const getAllMentorMeetings = async () => {
            let collectionRef = firestore.collection('meetings');
            const snapshot = await collectionRef.get();
            console.log(snapshot);

            snapshot.docs.forEach(doc => {
                console.log(doc.id);
            })


        };

        getAllMentorMeetings();
    }, []);

    return (
        <div>

        </div>
    );
};

export default MentorMeetings;