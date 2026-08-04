import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { getNavigationMeta } from "../helpers/PathHelper.js";

// Helper to extract the item with the highest frequency count
const getMostFrequentName = (namesObj = {}, fallbackId) => {
  const entries = Object.entries(namesObj);
  if (entries.length === 0) return fallbackId;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

// Calculate what % of games were played with the favorite character composition
const getFavoriteCompositionPercentage = (charactersObj = {}) => {
  const counts = Object.values(charactersObj);
  if (counts.length === 0) return "0%";
  const max = Math.max(...counts);
  const total = counts.reduce((sum, current) => sum + current, 0);
  return `${((max / total) * 100).toFixed(0)}%`;
};

// Calculate per-game efficiency stats safely
const getPerGameAverage = (totalValue = 0, totalGames = 0, decimals = 1) => {
  if (totalGames <= 0) return (0).toFixed(decimals);
  return (totalValue / totalGames).toFixed(decimals);
};

const Teams = ({ limit, dashboardMode = false }) => {
  const { getLeaderboard, loading, games } = useData();
  const params = useParams();
  const splatPath = params["*"] || ""; 

  const currentScope = useMemo(() => {
    if (!splatPath || splatPath === "all") return "/";
    return splatPath.startsWith("/") ? splatPath : `/${splatPath}`;
  }, [splatPath]);

  const { breadcrumbs, nextPotentialFolders } = useMemo(() => {
    if (loading || dashboardMode) return { breadcrumbs: [], nextPotentialFolders: [] };
    return getNavigationMeta(currentScope, games, "teams");
  }, [currentScope, games, loading, dashboardMode]);

  const sortedTeams = useMemo(() => {
    if (loading) return [];
    const contextPath = currentScope === "/" ? "/all" : `/all${currentScope}`;
    const allTeams = getLeaderboard("teams", contextPath) || [];
    const sorted = [...allTeams].sort((a, b) => b.averagePower - a.averagePower);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [getLeaderboard, loading, currentScope, limit]);

  if (loading) return <div style={{ padding: "20px", fontFamily: "sans-serif" }}>Loading teams...</div>;

  return (
    <div style={dashboardMode ? {} : { padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      
      {!dashboardMode && (
        <>
          <nav aria-label="Breadcrumb" style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}>
            <Link to="/teams" style={{ textDecoration: "none", color: "#0066cc" }}>Teams</Link>
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
              <small style={{ color: "#666", display: "block", marginBottom: "8px", fontWeight: "bold" }}>Filter teams deeper into this scope:</small>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {nextPotentialFolders.map((folder) => (
                  <Link key={folder} to={`/teams${currentScope === "/" ? "" : currentScope}/${folder}`} style={{ background: "#ffffff", padding: "6px 12px", border: "1px solid #ccc", borderRadius: "20px", textDecoration: "none", color: "#333", fontSize: "13px", fontWeight: "500" }}>
                    {folder} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", marginTop: "0" }}>
            Teams <span style={{ fontSize: "16px", color: "#666", fontWeight: "normal" }}>({currentScope === "/" ? "/all" : currentScope})</span>
          </h1>
        </>
      )}

      <section style={{ overflowX: "auto" }}>
        {sortedTeams.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic" }}>No team entries available.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", background: "#f9f9f9" }}>
                <th style={{ padding: "12px 8px" }}>Rank</th>
                <th style={{ padding: "12px 8px" }}>Team Composition</th>
                <th style={{ padding: "12px 8px" }}>Fav Comps (Pick %)</th>
                <th style={{ padding: "12px 8px", textAlign: "center" }}>Pool</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Avg Power</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>PR Points</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Placements</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Avg KOs</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Avg Dmg</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Games</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, index) => {
                const rosterArr = team.id ? team.id.split("-") : [];
                const totalGames = team.games?.length || 0;
                
                // Parse the hyphen-separated favorite character composition
                const favCompRaw = getMostFrequentName(team.characters, "");
                const favCompArr = favCompRaw ? favCompRaw.split("-") : [];

                return (
                  <tr key={team.id} style={{ borderBottom: "1px solid #eee", background: index % 2 === 0 ? "#ffffff" : "#fcfcfc" }}>
                    {/* Rank */}
                    <td style={{ padding: "12px 8px" }}><strong>#{index + 1}</strong></td>
                    
                    {/* Team Identity & Roster Map */}
                    <td style={{ padding: "12px 8px" }}>
                      <span style={{ color: "#9900cc", fontWeight: "600", display: "block" }}>
                        {getMostFrequentName(team.names, "Unnamed Club Team")}
                      </span>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "4px" }}>
                        {rosterArr.map((pid, pIdx) => (
                          <span key={pIdx} style={{ fontSize: "11px", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", color: "#555" }}>
                            👤 {pid}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Favorite Character Composition Mapping */}
                    <td style={{ padding: "12px 8px" }}>
                      {favCompArr.length > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
                          {favCompArr.map((char, cIdx) => (
                            <span key={cIdx} style={{ textTransform: "capitalize", background: "#eee", padding: "2px 6px", borderRadius: "4px", fontSize: "11px" }}>
                              {char}
                            </span>
                          ))}
                          <small style={{ color: "#666", fontWeight: "500", marginLeft: "2px" }}>
                            ({getFavoriteCompositionPercentage(team.characters)})
                          </small>
                        </div>
                      ) : (
                        <span style={{ color: "#888", fontSize: "12px" }}>None</span>
                      )}
                    </td>

                    {/* Team Composition Pool Size */}
                    <td style={{ padding: "12px 8px", textAlign: "center", color: "#666" }}>
                      {Object.keys(team.characters || {}).length}
                    </td>

                    {/* Core Ratings */}
                    <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold" }}>{team.averagePower.toFixed(2)}</td>
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#2e7d32", fontWeight: "600" }}>{team.totals?.powerRankPoints || 0}</td>
                    <td style={{ padding: "12px 8px", textAlign: "right" }}>{team.totals?.placementPoints || 0}</td>

                    {/* Calculated Game Production */}
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#333" }}>
                      {getPerGameAverage(team.totals?.knockoutPoints, totalGames, 1)}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#333" }}>
                      {getPerGameAverage(team.totals?.damageRaw, totalGames, 0)}
                    </td>

                    {/* Workload */}
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#555" }}>{totalGames}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Teams;
