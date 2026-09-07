import { useState } from "react";
import api from "../api/axios";
import Branches from "../Data/Branches";

const materialTypes = [
  { value: "notes", label: "Notes" },
  { value: "question_paper", label: "PYQ" },
  { value: "assignment", label: "Assignment" },
  { value: "syllabus", label: "Syllabus" },
];

function UploadFile() {
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [fileType, setFileType] = useState("notes");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("");

    if (!file) {
      setIsError(true);
      setMessage("Please choose a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append(
      "applicableFor",
      JSON.stringify([{ branch, semester: Number(semester) }])
    );
    formData.append("fileType", fileType);
    formData.append("file", file);

    try {
      setIsSubmitting(true);
      const { data } = await api.post("/files/upload", formData);
      setIsError(false);
      setMessage(data.message);
      setTitle("");
      setBranch("");
      setSemester("");
      setSubject("");
      setFileType("notes");
      setFile(null);
      form.reset();
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Unable to upload the file.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1>Upload Material</h1>
        <p>Help students by sharing quality resources</p>

        {message && <p role="alert" style={{ color: isError ? "red" : "green" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Material Title</label>
          <input
            id="title"
            type="text"
            placeholder="Example: Data Structures Notes"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="branch">Branch</label>
          <select
            id="branch"
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            required
          >
            <option value="">Select Branch</option>
            {Branches.map((branchOption) => (
              <option key={branchOption.id} value={branchOption.short}>
                {branchOption.short}
              </option>
            ))}
          </select>

          <label htmlFor="semester">Semester</label>
          <select
            id="semester"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
            required
          >
            <option value="">Select Semester</option>
            {Array.from({ length: 8 }, (_, index) => index + 1).map((semesterOption) => (
              <option key={semesterOption} value={semesterOption}>
                {semesterOption}
              </option>
            ))}
          </select>

          <label htmlFor="subject">Subject Name</label>
          <input
            id="subject"
            type="text"
            placeholder="Example: Digital Communication"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />

          <label htmlFor="fileType">Material Type</label>
          <select
            id="fileType"
            value={fileType}
            onChange={(event) => setFileType(event.target.value)}
          >
            {materialTypes.map((materialType) => (
              <option key={materialType.value} value={materialType.value}>
                {materialType.label}
              </option>
            ))}
          </select>

          <label htmlFor="file">Upload PDF</label>
          <input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            required
          />

          {file && <p className="selected-file">Selected: {file.name}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Material"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadFile;
