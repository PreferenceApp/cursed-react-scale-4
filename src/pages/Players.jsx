import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { getNavigationMeta } from "../helpers/PathHelper.js";

const Players = ({ limit, dashboardMode = false }) => {
  const { getLeaderboard, loading, games } = useData();
  const params = useParams();
  const splatPath = params["*"] || ""; 

  const currentScope = useMemo(() => {
    if (!splatPath || splatPath === "all") return "/";
    return splatPath.startsWith("/") ? splatPath : `/${splatPath}`;
  }, [splatPath]);

  const { breadcrumbs, nextPotentialFolders } = useMemo(() => {
    if (loading || dashboardMode) return { breadcrumbs: [], nextPotentialFolders: [] };
    return getNavigationMeta(currentScope, games, "players");
  }, [currentScope, games, loading, dashboardMode]);

  const sortedPlayers = useMemo(() => {
    if (loading) return [];
    const contextPath = currentScope === "/" ? "/all" : `/all${currentScope}`;
    const allPlayers = getLeaderboard("players", contextPath) || [];
    const sorted = [...allPlayers].sort((a, b) => b.averagePower - a.averagePower);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [getLeaderboard, loading, currentScope, limit]);

  // Helper to extract the item with the highest frequency count
  const getMostFrequent = (recordObj = {}, fallback = "N/A") => {
    const entries = Object.entries(recordObj);
    if (entries.length === 0) return fallback;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  if (loading) return <div style={{ padding: "20px", fontFamily: "sans-serif" }}>Loading players...</div>;

  return (
    <div style={dashboardMode ? {} : { padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      
      {!dashboardMode && (
        <>
          <nav aria-label="Breadcrumb" style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}>
            <Link to="/players" style={{ textDecoration: "none", color: "#0066cc" }}>Players</Link>
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

          {nextPotentialFolders.length > 0 && (
            <div style={{ background: "#f5f5f5", padding: "12px", marginBottom: "25px", borderRadius: "6px", border: "1px solid #e0e0e0" }}>
              <small style={{ color: "#666", display: "block", marginBottom: "8px", fontWeight: "bold" }}>Filter players deeper into this scope:</small>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {nextPotentialFolders.map((folder) => (
                  <Link key={folder} to={`/players${currentScope === "/" ? "" : currentScope}/${folder}`} style={{ background: "#ffffff", padding: "6px 12px", border: "1px solid #ccc", borderRadius: "20px", textDecoration: "none", color: "#333", fontSize: "13px", fontWeight: "500" }}>
                    {folder} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", marginTop: "0" }}>
            Players <span style={{ fontSize: "16px", color: "#666", fontWeight: "normal" }}>({currentScope === "/" ? "/all" : currentScope})</span>
          </h1>
        </>
      )}

      <section style={{ overflowX: "auto" }}>
        {sortedPlayers.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic" }}>No player entries available.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", background: "#f9f9f9" }}>
                <th style={{ padding: "12px 8px" }}>Rank</th>
                <th style={{ padding: "12px 8px" }}>Player</th>
                <th style={{ padding: "12px 8px" }}>Fav Character</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Avg Power</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>PR Points</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Placements</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>KOs</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Damage (Pts)</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Raw Damage</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Games</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={player.id} style={{ borderBottom: "1px solid #eee", background: index % 2 === 0 ? "#ffffff" : "#fcfcfc" }}>
                  {/* Rank */}
                  <td style={{ padding: "12px 8px" }}><strong>#{index + 1}</strong></td>
                  
                  {/* Player Identity */}
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{ color: "#0066cc", fontWeight: "600", display: "block" }}>
                      {getMostFrequent(player.names, player.id)}
                    </span>
                    {!dashboardMode && <small style={{ color: "#888", fontSize: "11px" }}>Discord: {player.id}</small>}
                  </td>

                  {/* Character Allocation */}
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{ textTransform: "capitalize", background: "#eee", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>
                      {getMostFrequent(player.characters, "None")}
                    </span>
                  </td>

                  {/* Metrics & Totals */}
                  <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold" }}>{player.averagePower.toFixed(2)}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right", color: "#2e7d32", fontWeight: "600" }}>{player.totals?.powerRankPoints || 0}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>{player.totals?.placementPoints || 0}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>{player.totals?.knockoutPoints || 0}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>{player.totals?.damagePoints || 0}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right", color: "#666" }}>{player.totals?.damageRaw?.toLocaleString() || 0}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right", color: "#555" }}>{player.games?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Players;
