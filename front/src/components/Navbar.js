import '../App.css';
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar-nav">
        <ul className="navbar-ul">
            <li className="navbar-li"><Link className="navbar-link" to="/uploadRecord">Upload</Link></li>
            <li className="navbar-li"><Link className="navbar-link" to="/records">List</Link></li>
            <li className="navbar-li"><Link className="navbar-link" to="/updateRecord">Update</Link></li>
            <li className="navbar-li"><Link className="navbar-link" to="/deleteRecord">Delete</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar;