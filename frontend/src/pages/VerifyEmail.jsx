import { useEffect, useRef, useState } from "react";
import {useParams,useNavigate} from "react-router-dom";

import api from "../api/axios";


function VerifyEmail(){


const {token}=useParams();

const navigate=useNavigate();
const hasVerified = useRef(false);
const [message, setMessage] = useState("Verifying email...");



useEffect(()=>{


async function verify(){

if (hasVerified.current) {
return;
}

hasVerified.current = true;


try{


const res =
await api.get(
`/auth/verify-email/${token}`
);


setMessage(res.data.message);


navigate("/login");


}


catch(error){

setMessage(
error.response?.data?.message || "Invalid verification link"
);

}


}



verify();


},[navigate, token]);



return(

<h1>{message}</h1>

)


}


export default VerifyEmail;
