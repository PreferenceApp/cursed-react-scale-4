import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import Players from "./Players.jsx";
import Teams from "./Teams.jsx";
import Characters from "./Characters.jsx";
import { getNavigationMeta } from "../helpers/PathHelper.js";

// Mock events data with eventName, eventId, and deadline
const events = [
  {
    eventId: "evt-001",
    eventName: "Winter Championship Qualifier",
    deadline: "2026-12-15T23:59:59Z"
  },
  {
    eventId: "evt-002",
    eventName: "Clan Speedrun Challenge",
    deadline: "2026-12-20T18:00:00Z"
  },
  {
    eventId: "evt-003",
    eventName: "Guild PvP Tournament",
    deadline: "2027-01-05T12:00:00Z"
  }
];

const Leaderboard = () => {
  const { loading, games } = useData();
  
  // Extract the wildcard route parameter from React Router
  const params = useParams();
  const splatPath = params["*"] || ""; 

  // Standardize path formats for reliable structural matches
  const currentScope = useMemo(() => {
    if (!splatPath || splatPath === "all") return "/";
    return splatPath.startsWith("/") ? splatPath : `/${splatPath}`;
  }, [splatPath]);

  // The master dashboard handles breadcrumbs and filtering for everything inside it
  const { breadcrumbs, nextPotentialFolders } = useMemo(() => {
    if (loading) return { breadcrumbs: [], nextPotentialFolders: [] };
    return getNavigationMeta(currentScope, games, "leaderboard"); 
  }, [currentScope, games, loading]);

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        Loading Dashboard Metrics...
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      
        {/* Active Events Segment */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #edf2f7", paddingBottom: "10px", marginBottom: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>📅 Active Events</h2>
            <Link to={`/events${splatPath ? `/${splatPath}` : ""}`} style={{ fontSize: "13px", textDecoration: "none", color: "#0066cc", fontWeight: "500" }}>
              View all events →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {events.map((event) => (
              <div 
                key={event.eventId} 
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}
              >
                <div>
                  <span style={{ fontWeight: "6px", color: "#1a202c", fontSize: "15px", display: "block" }}>{event.eventName}</span>
                  <small style={{ color: "#718096", fontSize: "12px" }}>ID: {event.eventId}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "13px", color: "#e53e3e", fontWeight: "600" }}>Deadline</span>
                  <span style={{ display: "block", fontSize: "13px", color: "#4a5568" }}>
                    {new Date(event.deadline).toLocaleDateString()} {new Date(event.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>


      {/* Universal Dashboard Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}>
        <Link to="/leaderboard" style={{ textDecoration: "none", color: "#0066cc" }}>Leaderboard</Link>
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.url}>
            {" / "}
            {idx === breadcrumbs.length - 1 ? (
              <strong style={{ color: "#333" }}>{crumb.name}</strong>
            ) : (
              <Link to={crumb.url} style={{ textDecoration: "none", color: "#0066cc" }}>{crumb.name}</Link>
            )}
          </span>
        ))}
      </nav>

      {/* Universal Dashboard Filter Pills */}
      {nextPotentialFolders.length > 0 && (
        <div style={{ background: "#f5f5f5", padding: "12px", marginBottom: "35px", borderRadius: "6px", border: "1px solid #e0e0e0" }}>
          <small style={{ color: "#666", display: "block", marginBottom: "8px", fontWeight: "bold" }}>Filter entire dashboard scope:</small>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {nextPotentialFolders.map((folder) => (
              <Link 
                key={folder} 
                to={`/leaderboard${currentScope === "/" ? "" : currentScope}/${folder}`}
                style={{ background: "#ffffff", padding: "6px 12px", border: "1px solid #ccc", borderRadius: "20px", textDecoration: "none", color: "#333", fontSize: "13px", fontWeight: "500", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                {folder} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Header Banner */}
      <div style={{ borderBottom: "3px solid #333", paddingBottom: "10px", marginBottom: "40px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#111" }}>Leaderboard</h1>
        <p style={{ color: "#666", margin: "5px 0 0 0", fontSize: "14px" }}>
          Active Scope: <strong style={{ color: "#222" }}>{currentScope === "/" ? "/all" : currentScope}</strong>
        </p>
      </div>

      {/* Three Panel Grid System */}
      <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
        
      

        {/* Top Players Segment */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #edf2f7", paddingBottom: "10px", marginBottom: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>🏆 Top Players</h2>
            <Link to={`/players${splatPath ? `/${splatPath}` : ""}`} style={{ fontSize: "13px", textDecoration: "none", color: "#0066cc", fontWeight: "500" }}>
              View full player list →
            </Link>
          </div>
          <Players limit={5} dashboardMode={true} />
        </section>

        {/* Top Teams Segment */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #edf2f7", paddingBottom: "10px", marginBottom: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>🛡️ Top Teams</h2>
            <Link to={`/teams${splatPath ? `/${splatPath}` : ""}`} style={{ fontSize: "13px", textDecoration: "none", color: "#0066cc", fontWeight: "500" }}>
              View full team list →
            </Link>
          </div>
          <Teams limit={5} dashboardMode={true} />
        </section>

        {/* Top Characters Segment */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #edf2f7", paddingBottom: "10px", marginBottom: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>⚡ Top Characters</h2>
            <Link to={`/characters${splatPath ? `/${splatPath}` : ""}`} style={{ fontSize: "13px", textDecoration: "none", color: "#0066cc", fontWeight: "500" }}>
              View full character list →
            </Link>
          </div>
          <Characters limit={5} dashboardMode={true} />
        </section>

      </div>
    </div>
  );
};

export default Leaderboard;
