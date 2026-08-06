import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useData } from "../context/DataContext";

// 1. Accept initialPlayer, a forced expanded state, and a click toggle function from the parent
export default function Player({ initialPlayer = null, standalone = false, forceExpanded = false, onToggle }) {
    const { playerId } = useParams();
    const { getPlayer, loading, error } = useData();
    const location = useLocation();
    const [player, setPlayer] = useState(initialPlayer || null);
    const [localExpanded, setLocalExpanded] = useState(false);

    useEffect(() => {
        if (initialPlayer) {
            setPlayer(initialPlayer);
            return;
        }

        async function load() {
            const path = location.pathname.replace(new RegExp(`^/player/${playerId}/?`), "");
            const data = await getPlayer(playerId, path);
            setPlayer(data);
        }
        load();
    }, [playerId, location.pathname, getPlayer, initialPlayer]);

    if (loading && !initialPlayer) return <h2 style={styles.message}>Loading dashboard...</h2>;
    if (error && !initialPlayer) return <h2 style={{...styles.message, color: "var(--danger-text)"}}>{error}</h2>;
    if (!player) return <div>Player not found.</div>;

    // Determine if the card should be expanded based on props or local state
    const isExpanded = forceExpanded || localExpanded;
    
    // Calculate the raw unpenalized average power for display comparison
    const rawAveragePower = player.gamesPlayed 
        ? (player.totals?.powerRankPoints || 0) / player.gamesPlayed 
        : 0;

    const isPenalized = (player.penaltyMultiplier || 1.0) < 1.0;

    const cardHeader = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem 1.5rem",
        cursor: initialPlayer ? "pointer" : "default"
    };

    const handleHeaderClick = () => {
        if (!initialPlayer) {
            return;
        }
        if (onToggle) {
            onToggle(player.id); // Parent handles toggle if in a list
        } else {
            setLocalExpanded(!localExpanded); // Component handles toggle if standalone
        }
    };

    return (
        // 1. If it's a standalone page, wrap it in the container layout. Otherwise, render cleanly for the list.
        <div style={!initialPlayer ? styles.container : null}>
            
            {/* 2. Page title header row: Only visible on the standalone page */}
            {!initialPlayer && (
                <div style={styles.headerRow}>
                    <h1 style={styles.title}>Player Profile</h1>
                </div>
            )}

            {/* 3. The exact same beautiful card design */}
            <div style={styles.card}>
                {/* Header Summary Row */}
                <div style={cardHeader} onClick={handleHeaderClick}>
                    <div style={styles.headerLeft}>
                        <span style={styles.rankBadge}>#{player.rank}</span>
                        <div>
                            <h2 style={styles.playerName}>
                                {player.primaryName}
                                {isPenalized && (
                                    <span style={styles.penaltyIndicator} title="Multiplier Active">
                                        ⚠️ {(player.penaltyMultiplier * 100).toFixed(0)}%
                                    </span>
                                )}
                            </h2>
                            <span style={styles.discordId}>ID: {player.id}</span>
                        </div>
                    </div>
                    <div style={styles.headerRight}>
                        <div style={styles.statMini}>
                            <span style={styles.statMiniLabel}>TRUE AVG POWER</span>
                            <span style={styles.statMiniValue}>
                                {player.averagePower?.toFixed(1) || "0.0"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                    <div style={styles.cardContent}>
                        <hr style={styles.divider} />
                        
                        {/* Grid layout for major stats */}
                        <div style={styles.statsGrid}>
                            <div style={styles.gridSection}>
                                <h3 style={styles.sectionTitle}>🏆 Career & Activity</h3>
                                <div style={styles.statRow}><span>Seasons Active</span><strong>{player.history?.seasons || 0}</strong></div>
                                <div style={styles.statRow}><span>Regions Explored</span><strong>{player.history?.regions || 0}</strong></div>
                                <div style={styles.statRow}><span>Events Played</span><strong>{player.history?.events || 0}</strong></div>
                                <div style={styles.statRow}><span>Total Match Games</span><strong>{player.gamesPlayed}</strong></div>
                            </div>

                            <div style={styles.gridSection}>
                                <h3 style={styles.sectionTitle}>⚔️ Performance Breakdown</h3>
                                <div style={styles.statRow}><span>Total Power Points</span><strong style={{color: "var(--primary)"}}>{player.totals?.powerRankPoints || 0}</strong></div>
                                <div style={styles.statRow}><span>Base Avg Power</span><strong>{rawAveragePower.toFixed(1)}</strong></div>
                                <div style={styles.statRow}><span>Season Multiplier</span><strong style={{color: isPenalized ? "var(--warning-text, #e65100)" : "inherit"}}>{(player.penaltyMultiplier || 1.0).toFixed(2)}x</strong></div>
                                <div style={styles.statRow}><span>Raw Damage Metric</span><strong>{(player.totals?.damageRaw || 0).toLocaleString()}</strong></div>
                            </div>

                           <div style={styles.gridSection}>
                                <h3 style={styles.sectionTitle}>🥋 Character Usage</h3>
                                {(!player.favoriteCharacters && !player.characters) || 
                                (player.favoriteCharacters?.length === 0 && Object.keys(player.characters || {}).length === 0) ? (
                                    <p style={styles.emptyText}>No character data</p>
                                ) : (
                                    // Normalize data into a uniform array of { id, count } objects
                                    (player.favoriteCharacters || Object.entries(player.characters || {}).map(([id, count]) => ({ id, count })))
                                        .map((char) => (
                                            <div key={char.id} style={styles.characterBadge}>
                                                <span style={styles.characterName}>{char.id}</span>
                                                <span style={styles.characterCount}>{char.count} matches</span>
                                            </div>
                                        ))
                                )}
                            </div>

                        </div>

                        {/* History Tree section */}
                        <div style={styles.treeSection}>
                            <h3 style={styles.sectionTitle}>🗺️ Event History Breakdown</h3>
                            {Object.entries(player.history?.tree || {}).map(([season, regions]) => (
                                <div key={season} style={styles.seasonBlock}>
                                    <div style={styles.seasonTitle}>{season.replace("-", " ").toUpperCase()}</div>
                                    {Object.entries(regions || {}).map(([region, events]) => (
                                        <div key={region} style={styles.regionBlock}>
                                            <span style={styles.regionBadge}>{region.toUpperCase()}</span>
                                            <div style={styles.eventGrid}>
                                                {Object.entries(events || {}).map(([event, gamesArray]) => (
                                                    <div key={event} style={styles.eventCard}>
                                                        <span style={styles.eventName}>{event.replace(/-/g, " ")}</span>
                                                        <span style={styles.eventCount}>{Array.isArray(gamesArray) ? gamesArray.length : 0} games</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
// Scoped layout styles mapping perfectly to your index.css color schema variables
const styles = {
    container: {
        width: "100%",           // Added: Forces container to take up full available width
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        boxSizing: "border-box", // Added: Prevents layout breaking from padding calculations
    },
    penaltyIndicator: {
        fontSize: "0.75rem",
        backgroundColor: "rgba(230, 81, 0, 0.15)",
        color: "#e65100",
        padding: "0.2rem 0.5rem",
        borderRadius: "4px",
        marginLeft: "0.75rem",
        verticalAlign: "middle",
        fontWeight: "bold"
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between", // Fixed "between" to "space-between"
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "2rem",
        borderBottom: "2px solid var(--border-color)",
        paddingBottom: "1rem",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "800",
        margin: 0,
        color: "var(--text-color)",
    },
    subtitle: {
        color: "var(--muted-color)",
        fontSize: "0.95rem",
        fontWeight: "500",
        marginLeft: "auto",
    },
    message: {
        textAlign: "center",
        padding: "4rem 2rem",
        color: "var(--muted-color)",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem", // Kept tight for your perfect dashboard dashboard look
    },
    card: {
        width: "100%",           // Added: Ensures the element stretches properly inside its parent
        backgroundColor: "var(--surface-color)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px var(--shadow-color)",
        overflow: "hidden",
        transition: "transform 0.15s ease",
        boxSizing: "border-box", // Added: Keeps card padding safely bounded
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
    rankBadge: {
        backgroundColor: "var(--secondary)",
        color: "#222222",
        fontWeight: "800",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "1.1rem",
    },
    playerName: {
        fontSize: "1.25rem",
        fontWeight: "700",
        margin: 0,
        color: "var(--text-color)",
    },
    discordId: {
        fontSize: "0.8rem",
        color: "var(--muted-color)",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "2rem",
    },
    statMini: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    statMiniLabel: {
        fontSize: "0.7rem",
        fontWeight: "700",
        color: "var(--muted-color)",
        letterSpacing: "0.5px",
    },
    statMiniValue: {
        fontSize: "1.3rem",
        fontWeight: "800",
        color: "var(--primary)",
    },
    arrow: {
        color: "var(--muted-color)",
        fontSize: "0.85rem",
        width: "20px",
        textAlign: "center",
    },
    cardContent: {
        padding: "0 1.5rem 1.5rem 1.5rem",
    },
    divider: {
        margin: "0 0 1.5rem 0",
        border: "none",
        borderTop: "1px solid var(--border-color)",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2rem",
        marginBottom: "2rem",
    },
    gridSection: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    sectionTitle: {
        fontSize: "0.95rem",
        fontWeight: "700",
        margin: "0 0 0.5rem 0",
        color: "var(--text-color)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    statRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 12px",
        backgroundColor: "var(--bg-color)",
        borderRadius: "6px",
        fontSize: "0.9rem",
    },
    characterBadge: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        fontSize: "0.9rem",
        backgroundColor: "var(--surface-color)",
    },
    characterName: {
        fontWeight: "600",
        color: "var(--text-color)",
    },
    characterCount: {
        fontSize: "0.8rem",
        color: "var(--muted-color)",
        backgroundColor: "var(--bg-color)",
        padding: "2px 8px",
        borderRadius: "4px",
    },
    emptyText: {
        fontSize: "0.85rem",
        color: "var(--muted-color)",
        fontStyle: "italic",
    },
    treeSection: {
        backgroundColor: "var(--bg-color)",
        padding: "1.25rem",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
    },
    seasonBlock: {
        marginBottom: "1rem",
    },
    seasonTitle: {
        fontSize: "0.85rem",
        fontWeight: "800",
        color: "var(--muted-color)",
        marginBottom: "0.5rem",
    },
    regionBlock: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        paddingLeft: "0.5rem",
        borderLeft: "2px solid var(--primary)",
    },
    regionBadge: {
        fontSize: "0.75rem",
        fontWeight: "700",
        color: "var(--primary)",
        alignSelf: "flex-start",
    },
    eventGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "0.5rem",
    },
    eventCard: {
        backgroundColor: "var(--surface-color)",
        border: "1px solid var(--border-color)",
        padding: "8px 12px",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.85rem",
    },
    eventName: {
        textTransform: "capitalize",
        color: "var(--text-color)",
    },
    eventCount: {
        color: "var(--muted-color)",
        fontWeight: "600",
    },
};
