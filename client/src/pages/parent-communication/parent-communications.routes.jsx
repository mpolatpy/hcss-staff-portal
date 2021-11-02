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
    const [total, setTotal ] = useState(0);
    const [allStudents, setAllStudents ] = useState({});
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

    const fetchStudents = async (schoolYear) => {
        const activeTerms = schoolYear.termsParentCommunication;
        if(!activeTerms || activeTerms.length === 0) return null;

        const termsSet = new Set(activeTerms);
        const students = {};

        const response = await axios({
            url: '/get-powerschool-data',
            method: 'post',
            data: {
                url: 'https://hcss.powerschool.com/ws/schema/query/com.hcss.admin.students_in_sections',
                queryParam: `teachers.teacher==${teacher.replace(',', '%2C')};sections.termid=ge=${activeTerms[0]}`,
            }
        });
        
        if(response.data && response.data.status === 'success' ){
            for(let record of response.data.result){
                if(termsSet.has(record.termid) && !record.course_name.startsWith('Study')){
                    let { student_number } = record;

                    if(student_number in students){
                        students[student_number] = {
                            ...students[student_number],
                            courses: [
                                ...students[student_number]['courses'],
                                {
                                    courseName: record.course_name,
                                    section: record.section_number,
                                    termid: record.termid,
                                }
                            ]
                        }
                    } else {
                        students[student_number] = {
                            student_number,
                            name: record.student_name,
                            grade: record.grade_level,
                            homeRoom: record.home_room,
                            courses: [
                                {
                                    courseName: record.course_name,
                                    section: record.section_number,
                                    termid: record.termid,
                                }
                            ]
                        }
                    }
                }
            }
        }
        return students;
    }
    
    const fetchCommunications = async () => {
        setLoading(true);
        const schoolYear = await fetchSchoolYear(); 
        const allStudents = await fetchStudents(schoolYear);
        if(!allStudents) {
            setLoading(false);
            return;
        }
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
                let communications = {}, students = {}, missingStudents={};
                const allCommunications = response.data.result;
                 
                for(let communication of allCommunications){
                    let {student_number} = communication;
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

                for(let student_number of Object.keys(allStudents)){
                    if(!students[student_number]){
                        missingStudents[student_number] = allStudents[student_number];
                    }
                }
                
                setAllStudents(allStudents);
                setCommunications(communications);
                setTotal(allCommunications.length);
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
                allStudents={allStudents}
                teacherList={teacherList} 
                setTeacher = {setTeacher}
                teacher={teacher}
                total={total}
                />
            }
            />
            <Route path={`${match.path}/student/:studentId`}
            render={ () => 
                <ParentCommunicationDetailPage 
                isLoading={isLoading} 
                communications={communications}
                students={allStudents} 
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