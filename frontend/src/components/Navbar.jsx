import logo from "../assets/nit kkr.jpg";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="NIT KKR Logo" className="logo" />

        <div>
          <h2>NIT Kurukshetra Study Hub</h2>
          <p>Notes • PYQs • Syllabus • YouTube</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;