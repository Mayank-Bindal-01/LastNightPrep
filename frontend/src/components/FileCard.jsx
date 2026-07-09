function FileCard({ file }) {

  return (

    <div className="file-card">

      <h3>
        {file.title}
      </h3>


      <p>
        Subject: {file.subject}
      </p>


      <p>
        Type: {file.fileType}
      </p>


      <a
        href={file.fileUrl}
        target="_blank"
        rel="noreferrer"
      >
        Open PDF
      </a>


    </div>

  );

}

export default FileCard;