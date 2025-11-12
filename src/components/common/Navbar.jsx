
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext"; 
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/deposit", label: "Deposit" },
    { to: "/withdraw", label: "Withdraw" },
    { to: "/history", label: "History" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        
        <div className="brand">
          <img src="/assets/images/logo.png" alt="Logo" className="logo" />
          <span className="brand-name">Smart ATM</span>
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>

        
        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-btn">
            {theme === "light" ? "🌞" : "🌙"}
          </button>

          {user && <span className="user-name">{user.first_name}</span>}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>

          {/* Mobile menu toggle */}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}
