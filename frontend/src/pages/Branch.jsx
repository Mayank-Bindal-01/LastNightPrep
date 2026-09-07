import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import FileCard from "../components/FileCard";

function Branch() {
  const { branchCode } = useParams();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadSyllabuses() {
      setIsLoading(true);
      setError("");

      try {
        const { data } = await api.get("/files/all", {
          params: { branch: branchCode, fileType: "syllabus" },
        });

        if (isCurrent) {
          setFiles(data.files);
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError.response?.data?.message || "Unable to load syllabuses.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadSyllabuses();
    return () => {
      isCurrent = false;
    };
  }, [branchCode]);

  return (
    <div className="page">
      <h1>{branchCode} Syllabus</h1>

      <div className="branch-container">
        {isLoading && <p>Loading syllabuses...</p>}
        {error && <p role="alert">{error}</p>}
        {!isLoading && !error && files.length === 0 && <h2>No Syllabus Uploaded</h2>}
        {files.map((file) => (
          <FileCard key={file._id} file={file} />
        ))}
      </div>
    </div>
  );
}

export default Branch;
