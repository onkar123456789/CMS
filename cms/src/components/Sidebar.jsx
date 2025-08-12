import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

export default function Sidebar() {
  const {user, logOut} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <h2>CMS Portal</h2>
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <NavLink to="/add">
                  Add Content
                </NavLink>
              </li>
              <li>
                <NavLink to="/view">
                  View Content
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup">
                  Signup
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      {user && (
        <div className="logout-section">
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      )}
    </aside>
  )
}