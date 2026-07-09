

import { useParams } from "react-router-dom";
import subjects from "../data/subjects";
import SubjectCard from "../components/SubjectCard";


function Semester(){

  const { branchCode, semesterId } = useParams();


  const semesterSubjects = subjects.filter(
    (subject) =>
      subject.branch === branchCode &&
      subject.semester === Number(semesterId)
  );


  return(
    <div className="page">

      <h1>
        {branchCode} - Semester {semesterId}
      </h1>


      <h2>
        Subjects
      </h2>


      <div className="subject-container">

        {
          semesterSubjects.map((subject)=>(

            <SubjectCard

              key={subject.id}

              subject={subject}

              branch={branchCode}

              semester={semesterId}

            />

          ))
        }


      </div>


    </div>
  )

}


export default Semester;