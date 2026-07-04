import semesters from "../data/Semester";
import SemesterCard from "../components/SemesterCard";

function Branch() {
  return (
    <div>
      <h1>Computer Engineering</h1>

      <h2>Select Semester</h2>

      <div className="semester-container">
        {semesters.map((semester) => (
          <SemesterCard
            key={semester.id}
            semester={semester}
          />
        ))}
      </div>
    </div>
  );
}

export default Branch;