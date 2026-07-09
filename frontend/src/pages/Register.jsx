function Register(){

return(

<div className="auth-page">


<div className="auth-card">


<h1>
Create Account
</h1>


<p>
Join Study Hub today
</p>



<form>


<input

type="text"

placeholder="Full Name"

/>


<input

type="email"

placeholder="Email Address"

/>


<input

type="password"

placeholder="Create Password"

/>


<input

type="password"

placeholder="Confirm Password"

/>



<button>

Sign Up

</button>


</form>



<div className="auth-link">

Already have account?

<a href="/login">
Login
</a>


</div>



</div>


</div>

)

}


export default Register;