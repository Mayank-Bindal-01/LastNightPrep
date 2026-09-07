import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/auth-context";


function Navbar(){

const { user, logout } = useAuth();

async function handleLogout() {
try {
  await api.post("/auth/logout");
} finally {
  logout();
}
}


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

{user ? (
<>
<Link to="/upload">
Upload
</Link>

<button type="button" className="nav-button" onClick={handleLogout}>
Logout
</button>
</>
) : (
<>
<Link to="/login">
Login
</Link>


<Link to="/register">
Sign Up
</Link>
</>
)}


</div>



</nav>

)

}


export default Navbar;
