import { useState } from "react";


function UploadFile(){


const [file,setFile] = useState(null);



return(

<div className="upload-page">


<div className="upload-card">


<h1>
Upload Material
</h1>


<p>
Help students by sharing quality resources
</p>



<form>



<label>
Material Title
</label>


<input

type="text"

placeholder="Example: Data Structures Notes"

/>



<label>
Branch
</label>


<select>

<option>
Select Branch
</option>

<option>
ECE
</option>

<option>
CSE
</option>

<option>
EE
</option>

<option>
ME
</option>

</select>




<label>
Semester
</label>


<select>

<option>
Select Semester
</option>

<option>
1
</option>

<option>
2
</option>

<option>
3
</option>

<option>
4
</option>

<option>
5
</option>

<option>
6
</option>

<option>
7
</option>

<option>
8
</option>


</select>




<label>
Subject Name
</label>


<input

type="text"

placeholder="Example: Digital Communication"

/>




<label>
Material Type
</label>


<select>


<option>
Notes
</option>


<option>
PYQ
</option>


<option>
Assignment
</option>


<option>
Syllabus
</option>


</select>





<label>
Upload File
</label>


<input

type="file"

onChange={(e)=>setFile(e.target.files[0])}

/>



{
file &&

<p className="selected-file">

Selected:
{file.name}

</p>

}




<label>
Description
</label>


<textarea

placeholder="Short description about material"

rows="4"

/>



<button>

Upload Material

</button>



</form>


</div>


</div>

)

}


export default UploadFile;