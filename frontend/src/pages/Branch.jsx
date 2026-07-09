
import { useParams } from "react-router-dom";
import syllabus from "../data/syllabus";


function Branch(){

const {branchCode}=useParams();



const branchData = syllabus.find(

(item)=>

item.branch===branchCode

);



return(

<div className="page">


<h1>
{branchCode} Syllabus
</h1>



<div className="branch-container">


{

branchData ?

branchData.files.map((file,index)=>(


<div className="branch-card" key={index}>


<h3>
{file.title}
</h3>



<a

href={file.pdf}

target="_blank"

rel="noreferrer"

>

Open PDF

</a>



</div>


))


:

<h2>
No Syllabus Uploaded
</h2>


}



</div>


</div>

)


}


export default Branch;