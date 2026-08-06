import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../context/DataContext";
import Player from "./Player.jsx";

export default function Players() {
    const { getPlayers, loading, error } = useData();
    const location = useLocation();
    const [players, setPlayers] = useState([]);
    const [expandedPlayers, setExpandedPlayers] = useState([]);

    useEffect(() => {
        async function load() {
            const path = location.pathname.replace(/^\/players\/?/, "");
            const data = await getPlayers(path);
            setPlayers(data || []);
        }
        load();
    }, [location.pathname, getPlayers]);

    const togglePlayer = (id) => {
        setExpandedPlayers((prev) =>
            prev.includes(id) 
                ? prev.filter((playerId) => playerId !== id) 
                : [...prev, id]
        );
    };

    if (loading) return <h2 style={styles.message}>Loading dashboard...</h2>;
    if (error) return <h2 style={{...styles.message, color: "var(--danger-text)"}}>{error}</h2>;

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h1 style={styles.title}>Leaderboard & Player Profiles</h1>
                <span style={styles.subtitle}>{players.length} Competitors Tracked</span>
            </div>

            <div style={styles.list}>
              {players.map((player) => (
                  <Player 
                      key={player.id} 
                      initialPlayer={player} 
                      forceExpanded={expandedPlayers.includes(player.id)}
                      onToggle={togglePlayer}
                  />
              ))}
          </div>
        </div>
    );
}

// Scoped layout styles mapping perfectly to your index.css color schema variables
const styles = {
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
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
    },
    card: {
        backgroundColor: "var(--surface-color)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px var(--shadow-color)",
        overflow: "hidden",
        transition: "transform 0.15s ease",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem 1.5rem",
        cursor: "pointer",
        userSelect: "none",
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
