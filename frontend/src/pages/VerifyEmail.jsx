import {useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom";

import api from "../api/axios";


function VerifyEmail(){


const {token}=useParams();

const navigate=useNavigate();



useEffect(()=>{


async function verify(){


try{


const res =
await api.get(
`/auth/verify-email/${token}`
);


alert(res.data.message);


navigate("/login");


}


catch(error){

alert(
"Invalid verification link"
);

}


}



verify();


},[]);



return(

<h1>
Verifying Email...
</h1>

)


}


export default VerifyEmail;