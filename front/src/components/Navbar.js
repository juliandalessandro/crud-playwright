import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      window.location = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-nav">
      <ul className="navbar-ul">
        <li className="navbar-li">
          <Link className="navbar-link" to="/">List</Link>
        </li>
        <li className="navbar-li">
          <Link className="navbar-link" to="/uploadRecord" data-testid="upload-record-button">Upload</Link>
        </li>
      </ul>

      {user && (
        <div className="menu-container" ref={dropdownRef}>

          {/* ✅ Mostrar ID de usuario */}
          <div className="user-id-label">
            User ID: <strong>{user.id}</strong>
          </div>

          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Abrir menú"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              <button className="dropdown-option" onClick={() => handleNavigate("/profile")}>Profile</button>
              <button className="dropdown-option" onClick={() => handleNavigate("/settings")}>Settings</button>
              <button className="dropdown-option" onClick={() => handleNavigate("/my-records")}>My Records</button>
              <hr className="dropdown-divider" />
              <button className="dropdown-option logout-option" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
