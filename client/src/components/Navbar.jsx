
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .nav-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: sticky; top: 0; z-index: 999;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(102,126,234,0.12);
          box-shadow: 0 2px 20px rgba(102,126,234,0.08);
        }
        .nav-inner {
          max-width: 1160px; margin: 0 auto;
          padding: 0 24px;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
          font-size: 22px; font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }
        .nav-logo-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; box-shadow: 0 4px 12px rgba(102,126,234,0.35);
        }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          padding: 8px 16px; border-radius: 10px;
          text-decoration: none; font-size: 14px; font-weight: 600;
          color: #555; transition: all 0.2s ease;
          position: relative;
        }
        .nav-link:hover { color: #667eea; background: rgba(102,126,234,0.08); }
        .nav-link.active {
          color: #667eea; background: rgba(102,126,234,0.1);
        }
        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .nav-user {
          display: flex; align-items: center; gap: 8px;
          background: rgba(102,126,234,0.08);
          border-radius: 12px; padding: 6px 14px;
          font-size: 13px; font-weight: 600; color: #555;
        }
        .nav-avatar {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px; font-weight: 700;
        }
        .nav-badge {
          font-size: 10px; padding: 2px 8px; border-radius: 100px;
          font-weight: 700; text-transform: capitalize;
        }
        .badge-student { background: #eef6ff; color: #1971c2; }
        .badge-organizer { background: #f3f0ff; color: #6741d9; }
        .badge-admin { background: #fff0f6; color: #c2255c; }
        .btn-login {
          padding: 9px 20px; border-radius: 10px;
          text-decoration: none; font-size: 14px; font-weight: 600;
          color: #667eea; border: 2px solid rgba(102,126,234,0.3);
          transition: all 0.2s; background: transparent;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .btn-login:hover { border-color: #667eea; background: rgba(102,126,234,0.06); }
        .btn-register {
          padding: 9px 20px; border-radius: 10px;
          text-decoration: none; font-size: 14px; font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none; cursor: pointer;
          box-shadow: 0 4px 14px rgba(102,126,234,0.35);
          transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .btn-register:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(102,126,234,0.45); }
        .btn-logout {
          padding: 9px 18px; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          color: #e03131; border: 2px solid rgba(224,49,49,0.2);
          background: transparent; cursor: pointer;
          transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .btn-logout:hover { background: #fff0f0; border-color: #e03131; }
        .dropdown { position: relative; }
        .dropdown-menu {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #fff; border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          border: 1px solid rgba(102,126,234,0.1);
          min-width: 200px; overflow: hidden;
          animation: dropIn 0.2s ease;
        }
        @keyframes dropIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px; text-decoration: none;
          font-size: 14px; font-weight: 600; color: #333;
          transition: background 0.15s;
          cursor: pointer; border: none; width: 100%;
          background: transparent; font-family: 'Plus Jakarta Sans', sans-serif;
          text-align: left;
        }
        .dropdown-item:hover { background: rgba(102,126,234,0.06); color: #667eea; }
        .dropdown-divider { height: 1px; background: #f0f0f0; margin: 4px 0; }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">🎪</div>
            EventSphere
          </Link>

          {/* Nav Links */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Events</Link>
            {user && <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>}
            {user?.role === "organizer" && (
              <Link to="/create-event" className={`nav-link ${isActive("/create-event") ? "active" : ""}`}>+ Create</Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>⚙️ Admin</Link>
            )}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {user ? (
              <div className="dropdown">
                <div className="nav-user" style={{ cursor: "pointer" }} onClick={() => setMenuOpen(!menuOpen)}>
                  <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <span>{user.name?.split(" ")[0]}</span>
                  <span className={`nav-badge badge-${user.role}`}>{user.role}</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>▼</span>
                </div>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      👤 My Profile
                    </Link>
                    {user.role === "student" && (
                      <Link to="/my-registrations" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        🎟️ My Registrations
                      </Link>
                    )}
                    {(user.role === "organizer" || user.role === "admin") && (
                      <Link to="/my-events" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        📋 My Events
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" style={{ color: "#e03131" }} onClick={() => { handleLogout(); setMenuOpen(false); }}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;