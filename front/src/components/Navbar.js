import '../App.css';
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authApi";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      sessionStorage.clear();
      window.location = "/login"; // ✅ mejor que navigate para evitar volver atrás
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="navbar-nav">
      <ul className="navbar-ul">
        <li className="navbar-li"><Link className="navbar-link" to="/">List</Link></li>
        <li className="navbar-li"><Link className="navbar-link" to="/uploadRecord">Upload</Link></li>  
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
