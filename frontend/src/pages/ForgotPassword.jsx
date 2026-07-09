function ForgotPassword(){

return(

<div className="auth-page">


<div className="auth-card">


<h1>
Reset Password
</h1>


<p>
Enter your email to receive reset link
</p>



<form>


<input

type="email"

placeholder="Enter Email"

/>



<button>

Send Link

</button>


</form>



<div className="auth-link">

Remember password?

<a href="/login">
Login
</a>


</div>



</div>


</div>

)

}


export default ForgotPassword;