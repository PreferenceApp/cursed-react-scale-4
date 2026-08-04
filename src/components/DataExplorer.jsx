import React from "react";
import { Link, useParams } from "react-router-dom";

const styles = {
  title: { textAlign: "center", marginBottom: "30px", fontSize: "32px", fontWeight: "900" },
  section: { marginBottom: "60px" },
  card: { background: "var(--surface-color)", borderRadius: "16px", padding: "24px", marginBottom: "24px", boxShadow: "0 10px 30px rgba(0,0,0,.08)", border: "1px solid rgba(0,0,0,0.03)" },
  nestedCard: { background: "rgba(0,0,0,.02)", border: "1px solid rgba(0,0,0,.05)", borderRadius: "12px", padding: "16px", marginTop: "16px" },
  header: { fontSize: "24px", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px", margin: "12px 0" },
  stat: { padding: "12px", background: "rgba(0,0,0,.04)", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.02)" },
  small: { fontSize: "13px", opacity: 0.7 },
  badge: { display: "inline-block", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", marginLeft: "8px" },
  row: { padding: "8px 12px", borderBottom: "1px solid rgba(0,0,0,.04)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  tag: { display: "inline-block", padding: "5px 12px", borderRadius: "20px", background: "rgba(0,0,0,.06)", margin: "4px", fontSize: "12px", fontWeight: "500" },
  primaryTag: { display: "inline-block", padding: "5px 12px", borderRadius: "20px", background: "rgba(0,102,204,0.1)", border: "1px solid rgba(0,102,204,0.15)", color: "#0066cc", margin: "4px", fontSize: "12px", fontWeight: "bold" },
  link: { textDecoration: "none", color: "inherit" },
  textLink: { color: "#0066cc", textDecoration: "none", fontWeight: "500" },
  subHeading: { marginTop: "24px", marginBottom: "12px", color: "rgba(0,0,0,0.85)", fontSize: "15px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }
};

// --- DATA PROCESSING & EXTRACTION HELPERS ---

const getSortedNames = (names = {}) => Object.entries(names || {}).sort((a, b) => b[1] - a[1]);

const getPrimaryName = (names = {}) => getSortedNames(names)?.[0]?.[0] || "Unknown";

// Calculates mathematical average power rank points safely
const getAveragePower = (entity = {}) => {
  const games = entity?.games?.length || 0;
  const points = entity?.totals?.powerRankPoints || 0;
  return games ? points / games : 0;
};

// Computes comprehensive synthetic data extensions from raw entity totals
const extractExtendedMetrics = (totals = {}, gamesCount = 0) => {
  const games = gamesCount || 1;
  const placement = totals?.placementPoints || 0;
  const knockouts = totals?.knockoutPoints || 0;
  const damageRaw = totals?.damageRaw || 0;
  const damagePoints = totals?.damagePoints || 0;

  return {
    avgPlacementPoints: (placement / games).toFixed(1),
    avgKnockoutsPerGame: (knockouts / games).toFixed(1),
    avgDamagePerGame: (damageRaw / games).toFixed(0),
    damageEfficiency: damageRaw ? (damagePoints / (damageRaw / 1000)).toFixed(2) : "0.00",
    combatToPlacementRatio: placement ? (knockouts / placement).toFixed(2) : "0.00"
  };
};

// Computes baseline values across entire collections for performance comparisons
const calculateGlobalBaselines = (data = {}) => {
  const extractBaselines = (group) => {
    const items = Object.values(group || {});
    if (!items.length) return { avgPRPerGame: 0, avgDamagePerGame: 0 };
    const totalPR = items.reduce((sum, item) => sum + (item.totals?.powerRankPoints || 0), 0);
    const totalGames = items.reduce((sum, item) => sum + (item.games?.length || 0), 0);
    const totalDamage = items.reduce((sum, item) => sum + (item.totals?.damageRaw || 0), 0);
    return {
      avgPRPerGame: totalGames ? totalPR / totalGames : 0,
      avgDamagePerGame: totalGames ? totalDamage / totalGames : 0
    };
  };

  return {
    playerBaseline: extractBaselines(data.players),
    teamBaseline: extractBaselines(data.teams),
    characterBaseline: extractBaselines(data.characters)
  };
};

// --- SUB-COMPONENTS ---

const StatBlock = ({ totals = {}, extended = {} }) => {
  const combined = { ...totals, ...extended };
  return (
    <div style={styles.grid}>
      {Object.entries(combined).map(([key, value]) => (
        <div key={key} style={styles.stat}>
          <b style={{ textTransform: "capitalize", fontSize: "11px", display: "block", marginBottom: "4px", opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {key.replace(/([A-Z])/g, " $1")}
          </b>
          <div style={{ fontSize: "15px", fontWeight: "700" }}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        </div>
      ))}
    </div>
  );
};

const NamesElement = ({ names = {} }) => {
  const sortedNames = getSortedNames(names);
  if (sortedNames.length === 0) return null;

  return (
    <div style={{ margin: "12px 0" }}>
      <span style={styles.primaryTag}>👑 {sortedNames[0][0]} ({sortedNames[0][1]})</span>
      {sortedNames.slice(1).map(([name, count]) => (
        <span key={name} style={styles.tag}>{name} ({count})</span>
      ))}
    </div>
  );
};

const GamesList = ({ games = [], pathSuffix }) => (
  <div>
    <h4 style={styles.subHeading}>Detailed Match History ({games?.length || 0})</h4>
    <div style={{ maxHeight: "160px", overflowY: "auto", background: "rgba(0,0,0,0.02)", borderRadius: "10px", padding: "6px", border: "1px solid rgba(0,0,0,0.03)" }}>
      {(games || []).map((gameId, index) => {
        const displayLabel = gameId.replace(/-/g, " ").toUpperCase();
        return (
          <div key={`${gameId}-${index}`} style={styles.row}>
            <span style={{ ...styles.small, fontFamily: "monospace" }}>{displayLabel}</span>
            <Link to={`/games/${gameId}${pathSuffix}`} style={styles.textLink}>View Match →</Link>
          </div>
        );
      })}
    </div>
  </div>
);

const DeviationBadge = ({ currentPRPerGame, baselinePRPerGame }) => {
  const diff = currentPRPerGame - baselinePRPerGame;
  const isAbove = diff >= 0;
  const pct = baselinePRPerGame ? ((Math.abs(diff) / baselinePRPerGame) * 100).toFixed(0) : 0;
  
  return (
    <span style={{
      ...styles.badge,
      background: isAbove ? "rgba(46, 204, 113, 0.15)" : "rgba(231, 76, 60, 0.15)",
      color: isAbove ? "#27ae60" : "#c0392b"
    }}>
      {isAbove ? "▲" : "▼"} {pct}% {isAbove ? "Above" : "Below"} Global Baseline
    </span>
  );
};

const PlayerCard = ({ id, player, rank, globalData, baseline, pathSuffix }) => {
  const gamesCount = player?.games?.length || 0;
  const extendedMetrics = extractExtendedMetrics(player?.totals, gamesCount);
  const currentAvgPR = gamesCount ? (player?.totals?.powerRankPoints || 0) / gamesCount : 0;

  const associatedTeams = React.useMemo(() => {
    return Object.entries(globalData?.teams || {})
      .filter(([teamId]) => teamId.split("-").includes(id))
      .map(([teamId, teamData]) => ({ id: teamId, name: getPrimaryName(teamData.names) }));
  }, [globalData?.teams, id]);

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
          <Link to={`/players/${id}${pathSuffix}`} style={styles.link}>
            #{rank} {getPrimaryName(player?.names)}
          </Link>
        </h3>
        <DeviationBadge currentPRPerGame={currentAvgPR} baselinePRPerGame={baseline} />
      </div>
      
      <div style={{ display: "flex", gap: "15px", marginBottom: "12px" }}>
        <div style={styles.small}>🔥 Avg PR / Game: <b>{getAveragePower(player).toFixed(2)}</b></div>
        <div style={styles.small}>🆔 Account ID: <code>{id}</code></div>
      </div>
      
      <NamesElement names={player?.names} />

      {associatedTeams.length > 0 && (
        <div style={{ margin: "10px 0", fontSize: "13px" }}>
          <span style={{ fontWeight: "600", color: "rgba(0,0,0,0.6)" }}>Active Rosters: </span>
          {associatedTeams.map(t => (
            <Link key={t.id} to={`/teams/${t.id}${pathSuffix}`} style={{ ...styles.textLink, marginRight: "10px", background: "rgba(0,0,0,0.03)", padding: "2px 6px", borderRadius: "4px" }}>
              🛡️ {t.name}
            </Link>
          ))}
        </div>
      )}
      
      <h4 style={styles.subHeading}>Cumulative & Calculated Analytics</h4>
      <StatBlock totals={player?.totals} extended={extendedMetrics} />
      
      <h4 style={styles.subHeading}>Character Allocation Counts</h4>
      <div style={{ margin: "8px 0" }}>
        {Object.entries(player?.characters || {}).map(([char, count]) => {
          const frequency = gamesCount ? ((count / gamesCount) * 100).toFixed(0) : 0;
          return (
            <span key={char} style={styles.tag}>
              🎮 {char.toUpperCase()}: <b>{count} games</b> ({frequency}%)
            </span>
          );
        })}
      </div>
      
      <GamesList games={player?.games} pathSuffix={pathSuffix} />
    </div>
  );
};

const TeamCard = ({ id, team, rank, globalData, baseline, pathSuffix }) => {
  const gamesCount = team?.games?.length || 0;
  const extendedMetrics = extractExtendedMetrics(team?.totals, gamesCount);
  const currentAvgPR = gamesCount ? (team?.totals?.powerRankPoints || 0) / gamesCount : 0;

  const playerIds = React.useMemo(() => (id ? id.split("-") : []), [id]);

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
          <Link to={`/teams/${id}${pathSuffix}`} style={styles.link}>
            #{rank} {getPrimaryName(team?.names)}
          </Link>
        </h3>
        <DeviationBadge currentPRPerGame={currentAvgPR} baselinePRPerGame={baseline} />
      </div>

      <div style={{ display: "flex", gap: "15px", marginBottom: "12px" }}>
        <div style={styles.small}>📊 Team Efficiency Index: <b>{getAveragePower(team).toFixed(2)}</b></div>
        <div style={styles.small}>🆔 Composite Team ID: <code>{id}</code></div>
      </div>
      
      <div style={{ margin: "14px 0", padding: "12px", background: "rgba(0,102,204,0.02)", border: "1px solid rgba(0,102,204,0.05)", borderRadius: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "8px", color: "#0066cc", textTransform: "uppercase" }}>
          Roster Breakdown Links
        </span>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {playerIds.map(pId => {
            const playerProfile = globalData?.players?.[pId];
            const nameStr = getPrimaryName(playerProfile?.names);
            return (
              <Link key={pId} to={`/players/${pId}${pathSuffix}`} style={{ ...styles.textLink, fontSize: "13px", background: "#fff", padding: "6px 10px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)" }}>
                👤 {nameStr !== "Unknown" ? nameStr : `Player ${pId}`}
              </Link>
            );
          })}
        </div>
      </div>
      
      <h4 style={styles.subHeading}>Team Summary Totals</h4>
      <StatBlock totals={team?.totals} extended={extendedMetrics} />
      
      <h4 style={styles.subHeading}>Composition Pick Alignments</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {Object.entries(team?.characters || {}).map(([compositionId, matchCount]) => {
          const individualCharacters = compositionId.split("-");
          return (
            <div key={compositionId} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,0,0,0.01)", padding: "4px 8px", borderRadius: "6px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {individualCharacters.map((char, i) => (
                  <span key={i} style={{ ...styles.tag, background: "rgba(0,0,0,0.05)", margin: 0, padding: "3px 8px", fontSize: "11px" }}>{char}</span>
                ))}
              </div>
              <span style={{ ...styles.small, fontWeight: "bold", color: "rgba(0,0,0,0.6)" }}>×{matchCount} Run(s)</span>
            </div>
          );
        })}
      </div>
      
      <GamesList games={team?.games} pathSuffix={pathSuffix} />
    </div>
  );
};

const CharacterCard = ({ id, character, rank, baseline, pathSuffix }) => {
  const gamesCount = character?.games?.length || 0;
  const extendedMetrics = extractExtendedMetrics(character?.totals, gamesCount);
  const currentAvgPR = gamesCount ? (character?.totals?.powerRankPoints || 0) / gamesCount : 0;

  // FIXED: Explicitly map and sort nested driver lists by their character-specific average power rank points
  const sortedDriversArr = React.useMemo(() => {
    return Object.entries(character?.players || {}).sort((a, b) => getAveragePower(b[1]) - getAveragePower(a[1]));
  }, [character?.players]);

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", color: "#0066cc" }}>
          <Link to={`/characters/${id}${pathSuffix}`} style={styles.link}>
            #{rank} 🕹️ {id.toUpperCase()}
          </Link>
        </h3>
        <DeviationBadge currentPRPerGame={currentAvgPR} baselinePRPerGame={baseline} />
      </div>
      <div style={styles.small}>Global Character Weight: <b>{getAveragePower(character).toFixed(2)}</b></div>
      
      <h4 style={styles.subHeading}>Global Unified Metrology</h4>
      <StatBlock totals={character?.totals} extended={extendedMetrics} />
      
      <h4 style={{ ...styles.subHeading, borderBottom: "2px solid rgba(0,0,0,0.06)", paddingBottom: "6px", marginTop: "32px" }}>
        Top Driver Allocations For {id.toUpperCase()} (Sorted by Avg PR)
      </h4>
      {sortedDriversArr.map(([playerId, playerData], index) => {
        const pGames = playerData?.games?.length || 0;
        const pExtended = extractExtendedMetrics(playerData?.totals, pGames);
        return (
          <div key={playerId} style={styles.nestedCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: "0 0 6px 0" }}>
                <Link to={`/players/${playerId}${pathSuffix}`} style={styles.link}>
                  #{index + 1} {getPrimaryName(playerData?.names)}
                </Link>
              </h4>
              <span style={{ fontSize: "11px", background: "#0066cc", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                {pGames} Character Match{pGames !== 1 && "es"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
              <div style={styles.small}>User Reference ID: <code>{playerId}</code></div>
              <div style={styles.small}>Driver Efficiency Value: <b>{getAveragePower(playerData).toFixed(2)}</b></div>
            </div>
            
            <span style={{ fontSize: "11px", fontWeight: "700", display: "block", marginTop: "12px", opacity: 0.5, textTransform: "uppercase" }}>
              Character-Specific Subtotals
            </span>
            <StatBlock totals={playerData?.totals} extended={pExtended} />
            <GamesList games={playerData?.games} pathSuffix={pathSuffix} />
          </div>
        );
      })}
    </div>
  );
};

const DataExplorer = ({ data = {}, title = "Data Explorer" }) => {
  // Destructure parameters matching the new layout order: region first
  const { region, year, season, event, game } = useParams();

  const pathSuffix = React.useMemo(() => {
    const tokens = [];
    // Updated push order to build: /all/region/year/season/event/game
    if (region) tokens.push(region);
    if (year) tokens.push(year);
    if (season) tokens.push(season);
    if (event) tokens.push(event);
    if (game) tokens.push(game);
    return tokens.length ? `/all/${tokens.join("/")}` : "";
  }, [region, year, season, event, game]);

  const baselines = React.useMemo(() => calculateGlobalBaselines(data), [data]);

  // FIXED: Explicitly sort primary player, team, and character maps by descending calculated average power rank 
  const playersArr = React.useMemo(() => Object.entries(data?.players || {}).sort((a, b) => getAveragePower(b[1]) - getAveragePower(a[1])), [data?.players]);
  const teamsArr = React.useMemo(() => Object.entries(data?.teams || {}).sort((a, b) => getAveragePower(b[1]) - getAveragePower(a[1])), [data?.teams]);
  const charactersArr = React.useMemo(() => Object.entries(data?.characters || {}).sort((a, b) => getAveragePower(b[1]) - getAveragePower(a[1])), [data?.characters]);

  return (
    <div style={{ padding: "30px 20px", maxWidth: "1240px", margin: "0 auto", fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: "#333", background: "var(--background-color)" }}>
      <h1 style={styles.title}>{title}</h1>

      <section style={styles.section}>
        <h2 style={styles.header}>👥 Ranked Players ({playersArr.length})</h2>
        {playersArr.map(([id, player], index) => (
          <PlayerCard key={id} id={id} player={player} rank={index + 1} globalData={data} baseline={baselines.playerBaseline.avgPRPerGame} pathSuffix={pathSuffix} />
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.header}>🛡️ Structured Teams ({teamsArr.length})</h2>
        {teamsArr.map(([id, team], index) => (
          <TeamCard key={id} id={id} team={team} rank={index + 1} globalData={data} baseline={baselines.teamBaseline.avgPRPerGame} pathSuffix={pathSuffix} />
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.header}>🕹️ Character Meta Traces ({charactersArr.length})</h2>
        {charactersArr.map(([id, char], index) => (
          <CharacterCard key={id} id={id} character={char} rank={index + 1} baseline={baselines.characterBaseline.avgPRPerGame} pathSuffix={pathSuffix} />
        ))}
      </section>
    </div>
  );
};

export default DataExplorer;
