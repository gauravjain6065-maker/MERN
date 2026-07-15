import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import { PlusCircle } from "lucide-react";

export default function MyListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "agent") {
      navigate("/");
      return;
    }

    fetchMyProperties();
  }, [user, navigate]);

  const fetchMyProperties = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/properties")
      .then((res) => {
        // Filter properties owned by this user
        const myProps = res.data.filter(p => p.owner && p.owner._id === user.id);
        setProperties(myProps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading my properties:", err);
        setError("Failed to load your listings.");
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`);
      // Remove from state
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing. Please try again.");
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
        <p>Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h2>My Property Listings</h2>
          <p style={{ color: "var(--text-muted)" }}>Manage the properties you have published on the platform.</p>
        </div>
        <Link to="/add-property" className="btn btn-primary" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <PlusCircle size={18} />
          <span>Add New Property</span>
        </Link>
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

      {properties.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "5rem 2rem",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)"
        }}>
          <h3 style={{ marginBottom: "0.5rem" }}>No Listings Yet</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>You haven't listed any properties for sale or rent yet.</p>
          <Link to="/add-property" className="btn btn-primary">Create Your First Listing</Link>
        </div>
      ) : (
        <div className="card-grid" style={{ marginTop: 0 }}>
          {properties.map((property) => (
            <PropertyCard 
              key={property._id} 
              property={property} 
              isOwner={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
