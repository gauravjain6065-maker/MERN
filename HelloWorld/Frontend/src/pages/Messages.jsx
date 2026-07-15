import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Mail, Phone, User, Trash2, Building, Clock, Inbox } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchMessages();
  }, [user, navigate]);

  const fetchMessages = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/messages")
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
        setError("Failed to load inquiry messages.");
        setLoading(false);
      });
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry message?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete message. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid var(--border-color)",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 1rem auto"
        }} />
        <p>Loading your inbox...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "3rem 1.5rem 5rem 1.5rem", maxWidth: "900px" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h2>Inbox / Buyer Inquiries</h2>
        <p style={{ color: "var(--text-muted)" }}>View and manage messages sent by prospective buyers or tenants interested in your properties.</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: "var(--danger)",
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          marginBottom: "1.5rem",
          fontWeight: 600
        }}>
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "5rem 2rem",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)"
        }}>
          <Inbox size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
          <h3 style={{ marginBottom: "0.5rem" }}>Your Inbox is Empty</h3>
          <p style={{ color: "var(--text-muted)" }}>Inquiries sent by customers on your listed properties will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {messages.map((msg) => {
            const dateStr = new Date(msg.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div key={msg._id} className="glass" style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                position: "relative"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "0.5rem"
                }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: "0.5rem", fontSize: "0.7rem" }}>Property Inquiry</span>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-heading)" }}>
                      {msg.property ? (
                        <Link to={`/properties/${msg.property._id}`} style={{ color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Building size={16} />
                          <span>{msg.property.title}</span>
                        </Link>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Deleted Property</span>
                      )}
                    </h3>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <Clock size={14} />
                      <span>{dateStr}</span>
                    </div>

                    <button 
                      onClick={() => handleDeleteMessage(msg._id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: "4px",
                        borderRadius: "var(--radius-sm)",
                        transition: "var(--transition)"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                      title="Delete inquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }} className="mobile-inbox-grid">
                  <div style={{
                    backgroundColor: "var(--bg-main)",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "0.9rem"
                  }}>
                    <p style={{ fontWeight: 700, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <User size={15} style={{ color: "var(--primary)" }} />
                      <span>{msg.senderName}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                      <Mail size={14} />
                      <a href={`mailto:${msg.senderEmail}`} style={{ color: "inherit", textDecoration: "underline", wordBreak: "break-all" }}>{msg.senderEmail}</a>
                    </p>
                    {msg.senderPhone && (
                      <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                        <Phone size={14} />
                        <a href={`tel:${msg.senderPhone}`} style={{ color: "inherit" }}>{msg.senderPhone}</a>
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.5rem" }}>Message Content</h4>
                    <p style={{
                      backgroundColor: "var(--bg-main)",
                      padding: "1rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-main)",
                      whiteSpace: "pre-line",
                      fontSize: "0.95rem",
                      lineHeight: 1.6
                    }}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .mobile-inbox-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
