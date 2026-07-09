import { useState } from "react";

function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");


  const handleSubmit=(e)=>{
    e.preventDefault();

    console.log(email,password);
  }


  return(

    <div className="auth-page">


      <div className="auth-card">


        <h1>
          Login
        </h1>


        <p>
          Welcome back to Study Hub
        </p>



        <form onSubmit={handleSubmit}>


          <input

          type="email"

          placeholder="Enter Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          />



          <input

          type="password"

          placeholder="Enter Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

          />



          <button type="submit">

            Login

          </button>


        </form>



        <div className="auth-link">

          Don't have account?

          <a href="/register">
            Sign Up
          </a>


        </div>


      </div>


    </div>

  )

}


export default Login;