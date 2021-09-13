import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentYear } from "../../redux/school-year/school-year.selectors";
import { selectTeacherOptions } from "../../redux/teachers/teachers.selectors";
import ParentCommunicationPage from "./parent-communication.page";
import ParentCommunicationDetailPage from "./parent-communication-detail.page";

const ParentCommunicationRoute = ({currentUser, currentYear, teacherList, match}) => {
    const [communications, setCommunications ] = useState([]);
    const [students, setStudents ] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [teacher, setTeacher ] = useState(`${currentUser.lastName}, ${currentUser.firstName}`);

    useEffect(() =>{  
        fetchCommunications();
    }, [currentUser, currentYear, teacher]);

    const fetchSchoolYear = async () => {
        const ref = firestore.collection('years');
        const snapshot = await ref.get();
        const years = {};
        if(!snapshot.empty){
            snapshot.docs.forEach(doc => years[doc.id] = doc.data());
        }

        return years[currentYear];
    };
    
    const fetchCommunications = async () => {
        setLoading(true);
        const schoolYear = await fetchSchoolYear(); 
        const queryParam = `LOG.entry_author==${teacher.replace(',', '%2C')};Log.entry_date=ge=${schoolYear.start_date}`;

        try{
            const response = await axios({
                url: '/get-powerschool-data',
                method: 'post',
                data: {
                    url: 'https://hcss.powerschool.com/ws/schema/query/com.hcss.admin.parent_communication',
                    queryParam: queryParam,
                }
            });

            if(response.data && response.data.status === 'success') {
                let communications = {}, students = {};

                for(let communication of response.data.result){
                    let student_number = communication.student_number;
                    if(student_number in communications){
                        communications[student_number] = [...communications[student_number], communication];
                    } else {
                        communications[student_number] = [ communication ];
                    }

                    if(!(student_number in students)){
                        students[student_number] = {
                            student_number,
                            name: communication.lastfirst,
                            grade: communication.grade_level,
                        }
                    }
        
                }

                setCommunications(communications);
                setStudents(students);
            }
        } catch(e){
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Route exact path={match.path} 
            render={ () => 
                <ParentCommunicationPage 
                isLoading={isLoading} 
                match={match}
                communications={communications}
                teacherList={teacherList} 
                setTeacher = {setTeacher}
                teacher={teacher}
                />
            }
            />
            <Route path={`${match.path}/student/:studentId`}
            render={ () => 
                <ParentCommunicationDetailPage 
                isLoading={isLoading} 
                communications={communications}
                students={students} 
                />
            }
            />
        </>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    currentYear: selectCurrentYear,
    teacherList: selectTeacherOptions
});

export default connect(mapStateToProps)(ParentCommunicationRoute);