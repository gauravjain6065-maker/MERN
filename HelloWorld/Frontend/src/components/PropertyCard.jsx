import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize, Trash2, Edit } from "lucide-react";

export default function PropertyCard({ property, isOwner, onDelete }) {
  const { _id, title, price, location, type, status, bedrooms, bathrooms, area, images } = property;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);

  const defaultImage = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
  const coverImage = images && images.length > 0 ? images[0] : defaultImage;

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: "var(--shadow-md)",
      transition: "var(--transition)",
      display: "flex",
      flexDirection: "column"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "var(--shadow-hover)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
    }}
    >
      {/* Property Image & Status Badge */}
      <div style={{ position: "relative", height: "200px", width: "100%", overflow: "hidden" }}>
        <img 
          src={coverImage} 
          alt={title} 
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          onError={(e) => { e.target.src = defaultImage; }}
        />
        
        {/* Badges Container */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
          <span className={`badge ${status === "sale" ? "badge-accent" : "badge-primary"}`}>
            For {status === "sale" ? "Sale" : "Rent"}
          </span>
          <span className="badge" style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", color: "white" }}>
            {type}
          </span>
        </div>
      </div>

      {/* Property Content */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem", color: "var(--text-heading)" }}>
          {formattedPrice}
          {status === "rent" && <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "normal" }}>/mo</span>}
        </h3>
        
        <h4 style={{ 
          fontSize: "1.1rem", 
          fontWeight: 600, 
          marginBottom: "0.5rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "var(--text-heading)"
        }}>
          {title}
        </h4>

        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          <MapPin size={16} style={{ color: "var(--primary)" }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{location}</span>
        </div>

        {/* Features Row */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          borderTop: "1px solid var(--border-color)", 
          paddingTop: "1rem", 
          marginTop: "auto",
          fontSize: "0.85rem",
          color: "var(--text-muted)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <BedDouble size={16} />
            <span>{bedrooms} Beds</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Bath size={16} />
            <span>{bathrooms} Baths</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Maximize size={16} />
            <span>{area} sqft</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
          {isOwner ? (
            <>
              <Link to={`/edit-property/${_id}`} className="btn btn-secondary btn-sm" style={{ flexGrow: 1, display: "flex", gap: "4px", alignItems: "center", justifyContent: "center" }}>
                <Edit size={14} />
                <span>Edit</span>
              </Link>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this listing?")) {
                    onDelete(_id);
                  }
                }}
                className="btn btn-danger btn-sm" 
                style={{ padding: "0.5rem 0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <Link 
              to={`/properties/${_id}`} 
              className="btn btn-primary btn-sm" 
              style={{ width: "100%", display: "block", textAlign: "center" }}
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
