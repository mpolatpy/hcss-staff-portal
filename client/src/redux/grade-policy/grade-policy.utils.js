import axios from 'axios';
import { firestore } from '../../firebase/firebase.utils';

const fetchCurrentYear = async () => {
    const ref = firestore.collection('years');
    const snapshot = await ref.get();
    let currentYear;
    if (!snapshot.empty) {
        snapshot.docs.forEach(doc => {
            const {isActiveYear} = doc.data();
            if(isActiveYear){
                currentYear = doc.data();
            }
        });
    }
    return currentYear;
};


export const getTeacherSchedules = async (selectedTeachers) => {
    const schoolYear = await fetchCurrentYear();
    const activeTerms = schoolYear.activePsTerms;
    const queryParam = `sections.termid=ge=${activeTerms[0]}`;
    const teachersSet = new Set(selectedTeachers.map( teacher => (teacher.lastFirst || `${teacher.lastName}, ${teacher.firstName}`)));
    
    try {
        const response = await axios.post('/get-powerschool-data', {
            url: 'https://hcss.powerschool.com/ws/schema/query/com.hcss.admin.teacher_schedules',
            queryParam: queryParam,
        }
        );

        if (response.data && response.data.status === 'success') {
            const scheduleData = response.data.result.filter(
                course => activeTerms.includes(course.termid)
            );
            const initialData = {};
            for( let course of scheduleData){
                const { section_id, lastfirst } = course;
                if(!teachersSet.has(lastfirst)) continue;

                if(lastfirst in initialData){
                    initialData[lastfirst][section_id] = {
                        course,
                        gradePolicy: '',
                        assignments: '',
                        scoresheet: '',
                        notes: ''
                    }
                } else{
                    initialData[lastfirst] = {
                        [section_id]: {
                            course,
                            gradePolicy: '',
                            assignments: '',
                            scoresheet: '',
                            notes: ''
                        }
                    }
                }
            }
            return initialData;
        }
    } catch (e) {
        console.log(e);
    } 
};

export const getOrCreateScoreDocument = async (observerId, year, teacherId) => {
    const scoreRef = firestore.doc(`gradebookChecks/${year}/summary/${observerId}`);
    const snapShot = await scoreRef.get();

    if(!snapShot.exists){
        try{
            await scoreRef.set({
                [teacherId]: 0
            });
        }catch(e){
            console.log('error creating score document', e.message)
        }
    }

    return scoreRef;
}