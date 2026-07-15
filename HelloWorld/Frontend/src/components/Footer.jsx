import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--bg-card)",
      borderTop: "1px solid var(--border-color)",
      padding: "3rem 0",
      marginTop: "auto",
      color: "var(--text-muted)",
      transition: "var(--transition)"
    }}>
      <div className="container" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        textAlign: "center"
      }}>
        {/* Branding */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-heading)"
        }}>
          <Home size={22} style={{ color: "var(--primary)" }} />
          <span>EstateFlow</span>
        </div>

        {/* Links */}
        <div style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          <Link to="/" style={{ color: "var(--text-main)", fontWeight: 500 }}>Home</Link>
          <Link to="/listings" style={{ color: "var(--text-main)", fontWeight: 500 }}>Properties</Link>
          <Link to="/listings?status=sale" style={{ color: "var(--text-main)", fontWeight: 500 }}>Buy</Link>
          <Link to="/listings?status=rent" style={{ color: "var(--text-main)", fontWeight: 500 }}>Rent</Link>
        </div>

        {/* Separator */}
        <div style={{
          width: "100%",
          maxWidth: "400px",
          height: "1px",
          backgroundColor: "var(--border-color)"
        }} />

        {/* Copyright */}
        <p style={{ fontSize: "0.875rem" }}>
          &copy; {new Date().getFullYear()} EstateFlow Inc. All rights reserved. Made with premium design aesthetics.
        </p>
      </div>
    </footer>
  );
}
