import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, BedDouble, Bath, Maximize, Mail, Phone, Calendar } from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/properties/${id}`)
      .then((res) => {
        setProperty(res.data);
        setLoading(false);
        setMessage(`Hi, I am interested in your property "${res.data.title}". Please get in touch with me.`);
      })
      .catch((err) => {
        console.error("Error fetching property detail:", err);
        setLoading(false);
      });
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormSuccess("");
    setFormError("");

    try {
      const res = await axios.post(`http://localhost:5000/api/properties/${id}/contact`, {
        senderName,
        senderEmail,
        senderPhone,
        message
      });
      setFormSuccess(res.data.message);
      setSenderName("");
      setSenderEmail("");
      setSenderPhone("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
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
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "8rem 2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Property Not Found</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>The property you are looking for does not exist or has been removed.</p>
        <Link to="/listings" className="btn btn-primary">Back to Listings</Link>
      </div>
    );
  }

  const { title, description, price, location, type, status, bedrooms, bathrooms, area, images, owner, createdAt } = property;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="container animate-fade-in" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
      <Link to="/listings" style={{ display: "inline-flex", color: "var(--primary)", fontWeight: 600, marginBottom: "1.5rem" }}>
        &larr; Back to listings
      </Link>

      <div className="details-grid" style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr",
        gap: "3rem",
        alignItems: "start"
      }}>
        {/* Left Column */}
        <div>
          <div style={{
            height: "450px",
            width: "100%",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
            marginBottom: "2rem"
          }}>
            <img 
              src={images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"} 
              alt={title} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
            <span className={`badge ${status === "sale" ? "badge-accent" : "badge-primary"}`}>
              For {status === "sale" ? "Sale" : "Rent"}
            </span>
            <span className="badge" style={{ backgroundColor: "var(--border-color)", color: "var(--text-heading)" }}>
              {type}
            </span>
          </div>

          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>{title}</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            <MapPin size={18} style={{ color: "var(--primary)" }} />
            <span>{location}</span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1.5rem",
            padding: "1.5rem",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            marginBottom: "2.5rem"
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Price</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary)" }}>{formattedPrice}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Bedrooms</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-heading)" }}>{bedrooms}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Bathrooms</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-heading)" }}>{bathrooms}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Area</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-heading)" }}>{area} sqft</p>
            </div>
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Description</h3>
            <p style={{ lineHeight: 1.7, color: "var(--text-main)", whiteSpace: "pre-line" }}>{description}</p>
          </div>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            fontSize: "0.85rem", 
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1rem"
          }}>
            <Calendar size={16} />
            <span>Listed on {formattedDate}</span>
          </div>
        </div>

        {/* Right Column */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            boxShadow: "var(--shadow-md)"
          }}>
            <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem" }}>Listed By Agent</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.25rem"
              }}>
                {owner?.name ? owner.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "var(--text-heading)", fontSize: "1.1rem" }}>{owner?.name || "Verified Agent"}</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Registered Partner</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={16} style={{ color: "var(--primary)" }} />
                <span style={{ wordBreak: "break-all" }}>{owner?.email || "agent@estateflow.com"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={16} style={{ color: "var(--primary)" }} />
                <span>+1 (555) 234-5678</span>
              </div>
            </div>

            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1rem" }}>Inquire About Property</h4>

            {formSuccess && (
              <div style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "var(--success)",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                marginBottom: "1rem",
                fontSize: "0.9rem",
                fontWeight: 600
              }}>
                {formSuccess}
              </div>
            )}

            {formError && (
              <div style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "var(--danger)",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                marginBottom: "1rem",
                fontSize: "0.9rem",
                fontWeight: 600
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Your Name" 
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Your Email" 
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="Your Phone (Optional)" 
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <textarea 
                  className="form-textarea" 
                  placeholder="Message" 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ minHeight: "100px" }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submitting}
                style={{ width: "100%", padding: "0.75rem" }}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
