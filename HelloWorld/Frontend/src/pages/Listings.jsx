import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { SlidersHorizontal } from "lucide-react";

export default function Listings() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search") || "";
    const urlType = params.get("type") || "all";
    const urlStatus = params.get("status") || "all";
    
    setSearch(urlSearch);
    setType(urlType);
    setStatus(urlStatus);

    fetchProperties({ search: urlSearch, type: urlType, status: urlStatus });
  }, [location.search]);

  const fetchProperties = (filterOverrides = {}) => {
    setLoading(true);
    const queryParams = {
      search: filterOverrides.search !== undefined ? filterOverrides.search : search,
      type: filterOverrides.type !== undefined ? filterOverrides.type : type,
      status: filterOverrides.status !== undefined ? filterOverrides.status : status,
      minPrice: filterOverrides.minPrice !== undefined ? filterOverrides.minPrice : minPrice,
      maxPrice: filterOverrides.maxPrice !== undefined ? filterOverrides.maxPrice : maxPrice,
      bedrooms: filterOverrides.bedrooms !== undefined ? filterOverrides.bedrooms : bedrooms,
    };

    const cleanParams = {};
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== "" && queryParams[key] !== "all") {
        cleanParams[key] = queryParams[key];
      }
    });

    axios.get("http://localhost:5000/api/properties", { params: cleanParams })
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleResetFilters = () => {
    setSearch("");
    setType("all");
    setStatus("all");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("all");
    fetchProperties({
      search: "",
      type: "all",
      status: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "all"
    });
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Available Properties</h2>
        <p style={{ color: "var(--text-muted)" }}>Use the filters to find properties that suit your requirements.</p>
      </div>

      <div className="listings-layout" style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "2.5rem",
        alignItems: "start"
      }}>
        {/* Filters Sidebar */}
        <aside className="glass" style={{
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem", color: "var(--text-heading)", fontWeight: 700 }}>
            <SlidersHorizontal size={18} style={{ color: "var(--primary)" }} />
            <span>Filters</span>
          </div>

          <form onSubmit={handleApplyFilters} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="form-group">
              <label className="form-label">Keyword</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search location or title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">Any Status</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <select className="form-select" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                <option value="all">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price Range</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "0.6rem" }}>
                Apply
              </button>
              <button type="button" onClick={handleResetFilters} className="btn btn-secondary" style={{ flex: 1, padding: "0.6rem" }}>
                Reset
              </button>
            </div>
          </form>
        </aside>

        {/* Results Main Section */}
        <main>
          {loading ? (
            <div style={{ textAlign: "center", padding: "5rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "3px solid var(--border-color)",
                borderTopColor: "var(--primary)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem auto"
              }} />
              <p>Searching matching listings...</p>
            </div>
          ) : properties.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "5rem 2rem",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)"
            }}>
              <h3 style={{ marginBottom: "0.5rem" }}>No Listings Found</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Try loosening your filters or keyword query.</p>
              <button onClick={handleResetFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div>
              <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontWeight: 600 }}>
                Showing {properties.length} {properties.length === 1 ? "property" : "properties"}
              </p>
              <div className="card-grid" style={{ marginTop: 0 }}>
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .listings-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
