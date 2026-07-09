


// import { useParams } from "react-router-dom";
// import subjects from "../data/subjects";

// function Subject() {
//   const { subjectName } = useParams();

//   const selectedSubject = subjects.find(
//     (sub) =>
//       sub.name.trim().toLowerCase() ===
//       decodeURIComponent(subjectName || "").trim().toLowerCase()
//   );

//   if (!selectedSubject) {
//     return <h2>Subject Not Found</h2>;
//   }

//   return (
//     <div className="subject-page">
//       <h1>{selectedSubject.name}</h1>

//       <h2>Syllabus</h2>
//       <a href={selectedSubject.syllabus}>View Syllabus</a>

//       <h2>Notes</h2>
//       {selectedSubject.notes.length === 0 ? (
//         <p>No Notes Available</p>
//       ) : (
//         selectedSubject.notes.map((note, index) => (
//           <div key={index}>
//             <a href={note.pdf}>{note.unit}</a>
//           </div>
//         ))
//       )}

//       <h2>PYQs</h2>
//       {selectedSubject.pyqs.length === 0 ? (
//         <p>No PYQs Available</p>
//       ) : (
//         selectedSubject.pyqs.map((pyq, index) => (
//           <div key={index}>
//             <a href={pyq.pdf}>{pyq.year}</a>
//           </div>
//         ))
//       )}

//       <h2>YouTube Playlists</h2>
//       {selectedSubject.youtube.map((video, index) => (
//         <div key={index}>
//           <a href={video.link} target="_blank" rel="noreferrer">
//             ▶ {video.title}
//           </a>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Subject;

import { useParams } from "react-router-dom";
import subjects from "../data/subjects";

function Subject() {
  const { branchCode, semester, subjectName } = useParams();

  const selectedSubject = subjects.find(
    (sub) =>
      sub.branch === branchCode &&
      String(sub.semester) === semester &&
      sub.name.trim().toLowerCase() ===
        decodeURIComponent(subjectName).trim().toLowerCase()
  );

  if (!selectedSubject) {
    return <h2>Subject Not Found</h2>;
  }

  return (
    <div className="subject-page">
      <div className="subject-card">
        <h1>{selectedSubject.name}</h1>
        <p>
          {selectedSubject.branch} | Semester {selectedSubject.semester}
        </p>
      </div>

      <div className="subject-section">
        <h2>Syllabus</h2>
        <a href={selectedSubject.syllabus}>View Syllabus</a>
      </div>

      <div className="subject-section">
        <h2>Notes</h2>

        {selectedSubject.notes.length === 0 ? (
          <p>No Notes Available</p>
        ) : (
          selectedSubject.notes.map((note, index) => (
            <div key={index}>
              <a href={note.pdf}>{note.unit}</a>
            </div>
          ))
        )}
      </div>

      <div className="subject-section">
        <h2>PYQs</h2>

        {selectedSubject.pyqs.length === 0 ? (
          <p>No PYQs Available</p>
        ) : (
          selectedSubject.pyqs.map((pyq, index) => (
            <div key={index}>
              <a href={pyq.pdf}>{pyq.year}</a>
            </div>
          ))
        )}
      </div>

      <div className="subject-section">
        <h2>YouTube Playlists</h2>

        {selectedSubject.youtube.map((video, index) => (
          <div key={index}>
            <a href={video.link} target="_blank" rel="noreferrer">
              ▶ {video.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subject;