import { Link } from "react-router-dom";

function BranchCard({ branch }) {
  return (
    
       <Link 
       to={`/branch/${branch.short}`}
       className="card-link"
      >
      <div className="branch-card">

        <h2>{branch.short}</h2>

        <p>
          {branch.name}
        </p>

      </div>
    </Link>
  );
}

export default BranchCard;