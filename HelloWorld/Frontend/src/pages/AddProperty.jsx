import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Save, ArrowLeft } from "lucide-react";

const IMAGE_PRESETS = [
  { name: "Luxury Villa", url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80" },
  { name: "Suburban House", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" },
  { name: "Downtown Loft", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" },
  { name: "Cozy Cabin", url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" }
];

export default function AddProperty() {
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("house");
  const [status, setStatus] = useState("sale");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [area, setArea] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== "agent") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/properties/${id}`)
        .then((res) => {
          const prop = res.data;
          setTitle(prop.title);
          setDescription(prop.description);
          setPrice(prop.price);
          setLocation(prop.location);
          setType(prop.type);
          setStatus(prop.status);
          setBedrooms(prop.bedrooms);
          setBathrooms(prop.bathrooms);
          setArea(prop.area);
          setImageUrl(prop.images?.[0] || "");
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading property for edit:", err);
          setError("Failed to load property data.");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      description,
      price: Number(price),
      location,
      type,
      status,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      images: imageUrl ? [imageUrl] : []
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/properties/${id}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/properties", payload);
      }
      navigate("/my-listings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save property. Please check the inputs.");
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
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
        <p>Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "3rem 1.5rem 5rem 1.5rem", maxWidth: "800px" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: 600, marginBottom: "1.5rem" }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "2.5rem",
        boxShadow: "var(--shadow-lg)"
      }}>
        <h2 style={{ marginBottom: "0.5rem" }}>{isEditMode ? "Edit Property Listing" : "List New Property"}</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Fill in the details to publish this property to our browse listings section.</p>

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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Property Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Modern 3-Bedroom Apartment in Downtown"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description *</label>
            <textarea 
              className="form-textarea" 
              placeholder="Describe the property's features, nearby amenities, transport facilities, etc."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="mobile-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price (USD) *</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="e.g. 350000"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location (City, Neighborhood) *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Seattle, WA"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="mobile-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Type *</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status *</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Area (sqft) *</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="e.g. 1500"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="mobile-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bedrooms *</label>
              <input 
                type="number" 
                className="form-input" 
                required
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bathrooms *</label>
              <input 
                type="number" 
                className="form-input" 
                required
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Image URL</label>
            <input 
              type="url" 
              className="form-input" 
              placeholder="e.g. https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div>
            <p className="form-label" style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Quick Selection: Or pick a beautiful preset property photo
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "10px"
            }}>
              {IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  style={{
                    border: imageUrl === preset.url ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    backgroundColor: "transparent",
                    transition: "var(--transition)",
                    position: "relative",
                    height: "80px"
                  }}
                >
                  <img src={preset.url} alt={preset.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: "rgba(15, 23, 42, 0.75)",
                    color: "white",
                    fontSize: "0.65rem",
                    padding: "2px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {imageUrl && (
            <div style={{
              height: "200px",
              width: "100%",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "1px solid var(--border-color)"
            }}>
              <img src={imageUrl} alt="Property Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem", display: "flex", gap: "8px", justifyContent: "center", marginTop: "1rem" }}
          >
            <Save size={18} />
            <span>{loading ? "Saving..." : isEditMode ? "Update Listing" : "Publish Listing"}</span>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 576px) {
          .mobile-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
