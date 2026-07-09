import {useState} from "react";
import {useParams,useNavigate} from "react-router-dom";

import api from "../api/axios";


function ResetPassword(){


const {token}=useParams();

const navigate=useNavigate();


const [password,setPassword]=useState("");



async function submit(e){

e.preventDefault();



try{


const res =
await api.post(
`/auth/reset-password/${token}`,
{
password
}
);



alert(res.data.message);


navigate("/login");


}


catch(error){

alert(
"Reset failed"
);

}


}




return(

<div>


<h1>
Create New Password
</h1>



<form onSubmit={submit}>


<input

type="password"

placeholder="New Password"

onChange={(e)=>setPassword(e.target.value)}

/>


<button>
Reset Password
</button>


</form>


</div>


)


}


export default ResetPassword;