import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus } from "lucide-react";

export default function Register() {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRole = params.get("role");
    if (urlRole === "agent" || urlRole === "user") {
      setRole(urlRole);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await register(name, email, password, role);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Create Account</h2>
          <p style={{ color: "var(--text-muted)" }}>Sign up to buy, rent, or list properties.</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            color: "var(--danger)",
            padding: "0.75rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="John Doe"
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@example.com"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">I want to register as a:</label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setRole("user")}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: role === "user" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  backgroundColor: role === "user" ? "var(--primary-light)" : "var(--bg-main)",
                  color: role === "user" ? "var(--primary)" : "var(--text-main)",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
              >
                Buyer / Tenant
              </button>
              <button
                type="button"
                onClick={() => setRole("agent")}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: role === "agent" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  backgroundColor: role === "agent" ? "var(--primary-light)" : "var(--bg-main)",
                  color: role === "agent" ? "var(--primary)" : "var(--text-main)",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
              >
                Owner / Agent
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem", display: "flex", gap: "8px", justifyContent: "center" }}
          >
            <UserPlus size={18} />
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
