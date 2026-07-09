import { Link } from "react-router-dom";


function SubjectCard({subject, branch, semester}){


return(

<Link
to={`/subject/${branch}/${semester}/${encodeURIComponent(subject.name)}`}
className="card-link"
>


<div className="card">

<h3>
{subject.name}
</h3>

</div>


</Link>

)


}


export default SubjectCard;