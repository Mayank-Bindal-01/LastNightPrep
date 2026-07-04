import { Link } from "react-router-dom";

function SemesterCard({ semester }) {
  return (
    <Link to="/semester">
      <div className="semester-card">
        <h3>{semester.name}</h3>
      </div>
    </Link>
  );
}

export default SemesterCard;