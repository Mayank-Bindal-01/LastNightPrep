import { Link } from "react-router-dom";


function Navbar(){


return(

<nav className="navbar">


<div className="logo-section">


<h2>
Study Hub
</h2>


</div>



<div className="nav-links">


<Link to="/">
Home
</Link>

<Link to="/search">
Search
</Link>

<Link to="/login">
Login
</Link>


<Link to="/register">
Sign Up
</Link>


<Link to="/upload">
Upload
</Link>


</div>



</nav>

)

}


export default Navbar;