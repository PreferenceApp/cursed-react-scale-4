import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { getNavigationMeta } from "../helpers/PathHelper.js";

// Safe calculation for per-game statistical performance
const getPerGameAverage = (totalValue = 0, totalGames = 0, decimals = 1) => {
  if (totalGames <= 0) return (0).toFixed(decimals);
  return (totalValue / totalGames).toFixed(decimals);
};

// Fixed tie-breaker function to accurately extract the most frequent name string
const getMostFrequentName = (namesObj = {}, fallbackId) => {
  const entries = Object.entries(namesObj);
  if (entries.length === 0) return fallbackId;
  // Properly sort by the frequency count value (index 1 of the entry pair)
  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

// Calculates individual player average power from totals, then grabs the top 3
const getTopThreePlayers = (playersObj = {}) => {
  const entries = Object.entries(playersObj);
  if (entries.length === 0) return [];

  // Map each player to include their dynamically calculated character-specific average power
  const processedPlayers = entries.map(([playerId, playerData]) => {
    const totalGames = playerData.games?.length || 0;
    const totalPrPoints = playerData.totals?.powerRankPoints || 0;
    
    // Compute the average power dynamically since it doesn't exist on the raw sub-object
    const calculatedAvgPower = totalGames > 0 ? totalPrPoints / totalGames : 0;
    const displayName = getMostFrequentName(playerData.names || {}, playerId);

    return {
      name: displayName,
      avgPower: calculatedAvgPower,
    };
  });

  // Sort players descending by their freshly calculated average power rating
  return processedPlayers
    .sort((a, b) => b.avgPower - a.avgPower)
    .slice(0, 3);
};

const Characters = ({ limit, dashboardMode = false }) => {
  const { getLeaderboard, loading, games } = useData();
  const params = useParams();
  const splatPath = params["*"] || ""; 

  const currentScope = useMemo(() => {
    if (!splatPath || splatPath === "all") return "/";
    return splatPath.startsWith("/") ? splatPath : `/${splatPath}`;
  }, [splatPath]);

  const { breadcrumbs, nextPotentialFolders } = useMemo(() => {
    if (loading || dashboardMode) return { breadcrumbs: [], nextPotentialFolders: [] };
    return getNavigationMeta(currentScope, games, "characters");
  }, [currentScope, games, loading, dashboardMode]);

  const sortedCharacters = useMemo(() => {
    if (loading) return [];
    const contextPath = currentScope === "/" ? "/all" : `/all${currentScope}`;
    const allChars = getLeaderboard("characters", contextPath) || [];
    const sorted = [...allChars].sort((a, b) => b.averagePower - a.averagePower);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [getLeaderboard, loading, currentScope, limit]);

  if (loading) return <div style={{ padding: "20px", fontFamily: "sans-serif" }}>Loading characters...</div>;

  return (
    <div style={dashboardMode ? {} : { padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      
      {!dashboardMode && (
        <>
          <nav aria-label="Breadcrumb" style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}>
            <Link to="/characters" style={{ textDecoration: "none", color: "#0066cc" }}>Characters</Link>
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
              <small style={{ color: "#666", display: "block", marginBottom: "8px", fontWeight: "bold" }}>Filter characters deeper into this scope:</small>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {nextPotentialFolders.map((folder) => (
                  <Link key={folder} to={`/characters${currentScope === "/" ? "" : currentScope}/${folder}`} style={{ background: "#ffffff", padding: "6px 12px", border: "1px solid #ccc", borderRadius: "20px", textDecoration: "none", color: "#333", fontSize: "13px", fontWeight: "500" }}>
                    {folder} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", marginTop: "0" }}>
            Characters <span style={{ fontSize: "16px", color: "#666", fontWeight: "normal" }}>({currentScope === "/" ? "/all" : currentScope})</span>
          </h1>
        </>
      )}

      <section style={{ overflowX: "auto" }}>
        {sortedCharacters.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic" }}>No character entries available.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", background: "#f9f9f9" }}>
                <th style={{ padding: "12px 8px" }}>Rank</th>
                <th style={{ padding: "12px 8px" }}>Character Name</th>
                <th style={{ padding: "12px 8px" }}>Top 3 Players (Avg Power)</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Power Rating</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Total PR Pts</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Avg KOs</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Avg Dmg</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Users</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Games</th>
              </tr>
            </thead>
            <tbody>
              {sortedCharacters.map((char, index) => {
                const uniqueUsersCount = char.players ? Object.keys(char.players).length : 0;
                const totalGames = char.games?.length || 0;
                
                // Extract top 3 players using the math-corrected functional pipeline
                const topThree = getTopThreePlayers(char.players || {});

                return (
                  <tr key={char.id} style={{ borderBottom: "1px solid #eee", background: index % 2 === 0 ? "#ffffff" : "#fcfcfc" }}>
                    {/* Rank */}
                    <td style={{ padding: "12px 8px" }}><strong>#{index + 1}</strong></td>
                    
                    {/* Character Identity */}
                    <td style={{ padding: "12px 8px" }}>
                      <span style={{ color: "#00994d", fontWeight: "600", textTransform: "capitalize" }}>
                        {char.id ? char.id.replace("-", " ") : "Unknown"}
                      </span>
                    </td>

                    {/* Top 3 Active Players sorted by Character Average Power */}
                    <td style={{ padding: "12px 8px" }}>
                      {topThree.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          {topThree.map((player, pIdx) => (
                            <div key={pIdx} style={{ fontSize: "13px" }}>
                              <span style={{ fontWeight: "500", color: "#333" }}>
                                {pIdx + 1}. {player.name}
                              </span>
                              <small style={{ color: "#0066cc", marginLeft: "6px", fontWeight: "bold" }}>
                                ({player.avgPower.toFixed(2)})
                              </small>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: "#888", fontSize: "12px" }}>N/A</span>
                      )}
                    </td>

                    {/* Meta Performance Ratings */}
                    <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold" }}>{char.averagePower.toFixed(2)}</td>
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#2e7d32", fontWeight: "600" }}>{(char.totals?.powerRankPoints || 0).toLocaleString()}</td>
                    
                    {/* Efficiency Stats */}
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#333" }}>
                      {getPerGameAverage(char.totals?.knockoutPoints, totalGames, 1)}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#333" }}>
                      {getPerGameAverage(char.totals?.damageRaw, totalGames, 0)}
                    </td>

                    {/* Counters */}
                    <td style={{ padding: "12px 8px", textAlign: "right", color: "#666" }}>{uniqueUsersCount}</td>
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

export default Characters;
