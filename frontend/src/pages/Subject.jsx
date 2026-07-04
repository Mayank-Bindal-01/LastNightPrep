import subjects from "../data/subjects";

function Subject() {
  const subject = subjects[0];

  return (
    <div className="subject-page">
      <h1>{subject.name}</h1>

      <h2>Syllabus</h2>
      <a href={subject.syllabus}>View Syllabus</a>

      <h2>Notes</h2>
      {subject.notes.length === 0 ? (
        <p>No Notes Available</p>
      ) : (
        subject.notes.map((note, index) => (
          <div key={index}>
            <a href={note.pdf}>{note.unit}</a>
          </div>
        ))
      )}

      <h2>PYQs</h2>
      {subject.pyqs.length === 0 ? (
        <p>No PYQs Available</p>
      ) : (
        subject.pyqs.map((pyq, index) => (
          <div key={index}>
            <a href={pyq.pdf}>{pyq.year}</a>
          </div>
        ))
      )}

      <h2>YouTube Playlists</h2>
      {subject.youtube.map((video, index) => (
        <div key={index}>
          <a
            href={video.link}
            target="_blank"
            rel="noreferrer"
          >
            ▶ {video.title}
          </a>
        </div>
      ))}
    </div>
  );
}

export default Subject;