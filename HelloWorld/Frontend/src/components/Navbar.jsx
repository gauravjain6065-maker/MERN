import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, MessageSquare, PlusCircle, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="glass" style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      padding: "1rem 0",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "var(--primary)"
        }}>
          <Home size={28} />
          <span>EstateFlow</span>
        </Link>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-heading)"
          }}
          className="mobile-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links */}
        <div 
          className={`nav-links ${isOpen ? "open" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem"
          }}
        >
          <Link to="/listings" className="nav-link" style={{ fontWeight: 600 }}>Properties</Link>
          
          {user && (
            <>
              {user.role === "agent" && (
                <>
                  <Link to="/add-property" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}>
                    <PlusCircle size={18} />
                    <span>List Property</span>
                  </Link>
                  <Link to="/my-listings" className="nav-link" style={{ fontWeight: 600 }}>My Listings</Link>
                </>
              )}
              <Link to="/messages" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}>
                <MessageSquare size={18} />
                <span>Inbox</span>
              </Link>
            </>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--primary-light)",
                border: "1px solid var(--border-color)",
                color: "var(--primary)",
                fontWeight: 700,
                fontSize: "0.85rem"
              }}>
                <User size={16} />
                <span>{user.name} ({user.role})</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block !important;
          }
          .nav-links {
            display: none !important;
            flex-direction: column;
            width: 100%;
            margin-top: 1rem;
            gap: 1rem !important;
            align-items: flex-start !important;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
          }
          .nav-links.open {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
