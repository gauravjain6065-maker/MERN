import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { Search, Award, ShieldCheck, DollarSign, ArrowRight } from "lucide-react";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/properties")
      .then((res) => {
        setProperties(res.data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let query = "?";
    if (search) query += `search=${search}&`;
    if (type !== "all") query += `type=${type}&`;
    if (status !== "all") query += `status=${status}&`;
    navigate(`/listings${query.slice(0, -1)}`);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "5rem", paddingBottom: "5rem" }}>
      {/* Hero Section */}
      <section style={{
        position: "relative",
        padding: "6rem 0 8rem 0",
        background: "linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(217, 119, 6, 0.05) 100%)",
        borderBottom: "1px solid var(--border-color)",
        textAlign: "center"
      }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <span className="badge badge-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>Real Estate Agent Platform</span>
          <h1 style={{ fontSize: "3.5rem", maxWidth: "800px", margin: "0 auto", lineHeight: 1.15 }}>
            Discover a Place You'll <span style={{ color: "var(--primary)" }}>Love to Live</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
            Browse through hundreds of high-quality property listings with transparent pricing and verified owners.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="glass" style={{
            display: "flex",
            gap: "1rem",
            padding: "1.25rem",
            borderRadius: "var(--radius-lg)",
            width: "100%",
            maxWidth: "850px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-color)",
            marginTop: "2rem",
            flexWrap: "wrap"
          }}>
            <div style={{ flex: 2, minWidth: "200px", display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--bg-main)", padding: "0 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <Search size={18} style={{ color: "var(--text-muted)" }} />
              <input 
                type="text" 
                placeholder="Enter city, neighborhood or title..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", background: "none", width: "100%", padding: "0.75rem 0", outline: "none", color: "var(--text-main)", fontSize: "0.95rem" }}
              />
            </div>

            <div style={{ flex: 1, minWidth: "140px" }}>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="form-select"
                style={{ height: "100%", border: "1px solid var(--border-color)" }}
              >
                <option value="all">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: "140px" }}>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
                style={{ height: "100%", border: "1px solid var(--border-color)" }}
              >
                <option value="all">Any Status</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ minWidth: "120px" }}>
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
          <div>
            <span className="badge badge-accent" style={{ marginBottom: "0.5rem" }}>Handpicked</span>
            <h2>Featured Listings</h2>
            <p style={{ color: "var(--text-muted)" }}>Explore our latest and most popular properties listed this week.</p>
          </div>
          <Link to="/listings" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: 700 }}>
            <span>Browse All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--border-color)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto"
            }} />
            <p>Loading premium properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "4rem 2rem",
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)"
          }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--text-muted)" }}>No properties have been listed yet.</p>
            <Link to="/add-property" className="btn btn-primary">List the First Property</Link>
          </div>
        ) : (
          <div className="card-grid">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Value Propositions / Why Choose Us */}
      <section style={{ backgroundColor: "var(--bg-card)", padding: "5rem 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Our Promise</span>
          <h2 style={{ marginBottom: "3rem" }}>Why Choose EstateFlow?</h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            marginTop: "2rem"
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Verified Listings</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Every single property listed on our site is vetted and verified by our support team for maximum security.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--accent-light)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <DollarSign size={32} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>No Hidden Commissions</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                We believe in transparency. What you see is what you pay. Deal directly with agents or sellers with zero hidden fees.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Award size={32} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Premium Client Care</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Our 24/7 dedicated support team is here to assist you through every single step of buying or renting your property.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
          color: "var(--text-white)",
          padding: "4rem 3rem",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
          boxShadow: "var(--shadow-lg)"
        }}>
          <div>
            <h2 style={{ color: "white", marginBottom: "0.75rem" }}>Are You an Agent or Property Owner?</h2>
            <p style={{ opacity: 0.9, maxWidth: "600px", fontSize: "1.05rem" }}>
              List your house, apartment, land, or villa today and reach thousands of prospective buyers looking for a place to settle down.
            </p>
          </div>
          <Link to="/register?role=agent" className="btn" style={{
            backgroundColor: "white",
            color: "var(--primary)",
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: 700
          }}>
            <span>Start Selling</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
