import {
  useEffect,
  useState,
} from "react";

import {
  useData,
} from "../context/DataContext.jsx";

import {
  getCharacters,
} from "../data/characters.js";

import {
  getPlayerNames,
  getTeamNames,

  getPlayerGameCount,
  getPlayerWins,
  getPlayerTop3,

  getPlayerPowerRankPoints,
  getPlayerAdjustedAveragePowerRank,

  getPlayerGames,

  getCharacterGameCount,
  getCharacterWins,
  getCharacterTop3,

  getCharacterPowerRankPoints,
  getCharacterAdjustedAveragePowerRank,

  getTeamCharacterCombos,
} from "../utils/scoring.js";

// ============================================================
// Styles
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-color)",
    color: "var(--text-color)",
    padding: "60px 20px",
  },

  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    padding: "70px 20px 80px",
  },

  eyebrow: {
    fontSize: "0.85rem",
    fontWeight: 800,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--primary)",
    marginBottom: "18px",
  },

  title: {
    fontSize: "clamp(2.5rem, 7vw, 5rem)",
    fontWeight: 900,
    lineHeight: 1,
    margin: "0 auto 20px",
    maxWidth: "900px",
  },

  subtitle: {
    fontSize: "1.1rem",
    color: "var(--muted-color)",
    maxWidth: "650px",
    margin: "0 auto",
    lineHeight: 1.6,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "60px",
  },

  statCard: {
    background: "var(--surface-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "25px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px var(--shadow-color)",
  },

  statNumber: {
    fontSize: "2rem",
    fontWeight: 900,
    marginBottom: "5px",
  },

  statLabel: {
    color: "var(--muted-color)",
    fontSize: "0.9rem",
  },

  section: {
    marginBottom: "60px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "1.7rem",
    fontWeight: 900,
    margin: 0,
  },

  sectionDescription: {
    color: "var(--muted-color)",
    marginTop: "6px",
    fontSize: "0.9rem",
  },

  leaderboard: {
    background: "var(--surface-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 10px 30px var(--shadow-color)",
  },

  row: {
    display: "grid",
    gridTemplateColumns:
      "55px 1fr auto",
    alignItems: "center",
    gap: "15px",
    padding: "18px 22px",
    borderBottom:
      "1px solid var(--border-color)",
  },

  rank: {
    fontSize: "1.2rem",
    fontWeight: 900,
    color: "var(--muted-color)",
  },

  name: {
    fontWeight: 800,
    fontSize: "1rem",
  },

  details: {
    color: "var(--muted-color)",
    fontSize: "0.8rem",
    marginTop: "4px",
  },

  score: {
    textAlign: "right",
    fontWeight: 900,
  },

  scoreLabel: {
    color: "var(--muted-color)",
    fontSize: "0.75rem",
    marginTop: "2px",
  },

  games: {
    color: "var(--muted-color)",
    fontSize: "0.8rem",
  },

  gameGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },

  gameCard: {
    background: "var(--surface-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "20px",
  },

  gameTitle: {
    fontWeight: 800,
    marginBottom: "8px",
  },

  gamePath: {
    color: "var(--muted-color)",
    fontSize: "0.85rem",
  },

  loading: {
    textAlign: "center",
    padding: "100px 20px",
    color: "var(--muted-color)",
  },

  error: {
    textAlign: "center",
    padding: "100px 20px",
    color: "var(--muted-color)",
  },
};

// ============================================================
// Helpers
// ============================================================

function formatNumber(number) {
  return Number(
    number || 0
  ).toLocaleString();
}

function formatGamePath(path) {
  const parts = String(path)
    .split("/")
    .filter(Boolean);

  if (parts.length < 4) {
    return path;
  }

  const [
    season,
    region,
    event,
    game,
  ] = parts;

  return `${season} • ${region.toUpperCase()} • ${
    event.replace("-", " ")
  } • ${game.replace("-", " ")}`;
}

// ============================================================
// Character Name
// ============================================================

function getCharacterName(
  characters,
  characterId
) {
  const character =
    characters.find(
      (character) =>
        String(
          character.id ??
          character.characterId
        ) === String(characterId)
    );

  return (
    character?.name ||
    character?.displayName ||
    `Character #${characterId}`
  );
}

// ============================================================
// Team Helpers
// ============================================================

function getTeamPlayerIds(teamId) {
  return String(teamId)
    .split("-")
    .filter(Boolean);
}

function getTeamGames(
  totals,
  teamId
) {
  const playerIds =
    getTeamPlayerIds(teamId);

  if (!playerIds.length) {
    return {};
  }

  const playerGames =
    playerIds.map(
      (playerId) =>
        getPlayerGames(
          totals,
          playerId
        )
    );

  const firstGames =
    playerGames[0] || {};

  const teamGames = {};

  Object.keys(
    firstGames
  ).forEach((gamePath) => {
    const allPlayersPresent =
      playerGames.every(
        (games) =>
          games?.[gamePath] === 1
      );

    if (allPlayersPresent) {
      teamGames[gamePath] = 1;
    }
  });

  return teamGames;
}

function getTeamGameCount(
  totals,
  teamId
) {
  return Object.keys(
    getTeamGames(
      totals,
      teamId
    )
  ).length;
}

function getTeamPowerRankPoints(
  totals,
  teamId
) {
  const playerIds =
    getTeamPlayerIds(teamId);

  return playerIds.reduce(
    (total, playerId) => {
      return (
        total +
        getPlayerPowerRankPoints(
          totals,
          playerId
        )
      );
    },
    0
  );
}

function getTeamWins(
  totals,
  teamId
) {
  const playerIds =
    getTeamPlayerIds(teamId);

  return Math.min(
    ...playerIds.map(
      (playerId) =>
        getPlayerWins(
          totals,
          playerId
        )
    )
  );
}

function getTeamTop3(
  totals,
  teamId
) {
  const playerIds =
    getTeamPlayerIds(teamId);

  return Math.min(
    ...playerIds.map(
      (playerId) =>
        getPlayerTop3(
          totals,
          playerId
        )
    )
  );
}

function getTeamAdjustedAveragePowerRank(
  totals,
  teamId
) {
  const gamesPlayed =
    getTeamGameCount(
      totals,
      teamId
    );

  if (!gamesPlayed) {
    return 0;
  }

  const powerRankPoints =
    getTeamPowerRankPoints(
      totals,
      teamId
    );

  const average =
    powerRankPoints /
    gamesPlayed;

  const penaltyMultiplier =
    Math.min(
      1.00,
      0.10 +
        gamesPlayed * 0.05
    );

  return (
    average *
    penaltyMultiplier
  );
}

// ============================================================
// Leaderboard
// ============================================================

function Leaderboard({
  title,
  description,
  items = [],
  type,
}) {
  const topItems =
    items.slice(0, 5);

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>
            {title}
          </h2>

          <div
            style={
              styles.sectionDescription
            }
          >
            {description}
          </div>
        </div>
      </div>

      <div style={styles.leaderboard}>
        {topItems.map(
          (item, index) => (
            <div
              key={item.id}
              style={{
                ...styles.row,
                borderBottom:
                  index ===
                  topItems.length - 1
                    ? "none"
                    : styles.row
                        .borderBottom,
              }}
            >
              <div style={styles.rank}>
                #{index + 1}
              </div>

              <div>
                <div style={styles.name}>
                  {type ===
                  "character"
                    ? item.name
                    : item.primaryName}
                </div>

                <div
                  style={
                    styles.details
                  }
                >
                  {item.wins} win
                  {item.wins !== 1
                    ? "s"
                    : ""}

                  {" • "}

                  {item.top3} podium
                  {item.top3 !== 1
                    ? "s"
                    : ""}

                  {" • "}

                  <span
                    style={
                      styles.games
                    }
                  >
                    {item.gamesPlayed}{" "}
                    games
                  </span>
                </div>
              </div>

              <div
                style={
                  styles.score
                }
              >
                {Number(
                  item.adjustedAveragePowerRank ||
                    0
                ).toFixed(1)}

                <div
                  style={
                    styles.scoreLabel
                  }
                >
                  POWER / GAME
                </div>
              </div>
            </div>
          )
        )}

        {!topItems.length && (
          <div
            style={{
              padding: "30px",
              color:
                "var(--muted-color)",
            }}
          >
            No data available.
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// Home
// ============================================================

export default function Home() {
  const {
    getData,
    loading,
    error,
  } = useData();

  const [
    leaderboardPlayers,
    setLeaderboardPlayers,
  ] = useState([]);

  const [
    leaderboardTeams,
    setLeaderboardTeams,
  ] = useState([]);

  const [
    leaderboardCharacters,
    setLeaderboardCharacters,
  ] = useState([]);

  const [
    games,
    setGames,
  ] = useState([]);

  const [
    totalPlayerCount,
    setTotalPlayerCount,
  ] = useState(0);

  const [
    totalTeamCount,
    setTotalTeamCount,
  ] = useState(0);

  const [
    totalCharacterCount,
    setTotalCharacterCount,
  ] = useState(0);

  // ==========================================================
  // Load Data
  // ==========================================================

  useEffect(() => {
    async function loadData() {
      const data =
        await getData();

      if (!data) {
        return;
      }

      // ======================================================
      // Characters
      // ======================================================

      const characterData =
        getCharacters(data) || [];

      // ======================================================
      // Players
      // ======================================================

      const playerIds =
        Object.keys(
          data?.names?.players || {}
        );

      const players =
        playerIds.map(
          (playerId) => {
            const names =
              getPlayerNames(
                data,
                playerId
              );

            const gamesPlayed =
              getPlayerGameCount(
                data,
                playerId
              );

            return {
              id: playerId,

              primaryName:
                Object.entries(
                  names
                ).sort(
                  (a, b) =>
                    Number(b[1]) -
                    Number(a[1])
                )[0]?.[0] ||
                `Player #${playerId}`,

              gamesPlayed,

              wins:
                getPlayerWins(
                  data,
                  playerId
                ),

              top3:
                getPlayerTop3(
                  data,
                  playerId
                ),

              powerRankPoints:
                getPlayerPowerRankPoints(
                  data,
                  playerId
                ),

              adjustedAveragePowerRank:
                getPlayerAdjustedAveragePowerRank(
                  data,
                  playerId
                ),
            };
          }
        );

      players.sort(
        (a, b) =>
          b.adjustedAveragePowerRank -
          a.adjustedAveragePowerRank
      );

      // ======================================================
      // Teams
      // ======================================================

      const teamIds =
        Object.keys(
          data?.names?.teams || {}
        );

      const teams =
        teamIds.map(
          (teamId) => {
            const names =
              getTeamNames(
                data,
                teamId
              );

            const gamesPlayed =
              getTeamGameCount(
                data,
                teamId
              );

            return {
              id: teamId,

              primaryName:
                Object.entries(
                  names
                ).sort(
                  (a, b) =>
                    Number(b[1]) -
                    Number(a[1])
                )[0]?.[0] ||
                `Team #${teamId}`,

              gamesPlayed,

              wins:
                getTeamWins(
                  data,
                  teamId
                ),

              top3:
                getTeamTop3(
                  data,
                  teamId
                ),

              powerRankPoints:
                getTeamPowerRankPoints(
                  data,
                  teamId
                ),

              adjustedAveragePowerRank:
                getTeamAdjustedAveragePowerRank(
                  data,
                  teamId
                ),

              characterCombos:
                getTeamCharacterCombos(
                  data,
                  teamId
                ),
            };
          }
        );

      teams.sort(
        (a, b) =>
          b.adjustedAveragePowerRank -
          a.adjustedAveragePowerRank
      );

      // ======================================================
      // Characters
      // ======================================================

      const characterIds =
        Object.keys(
          data?.games?.characters || {}
        );

      const characters =
        characterIds.map(
          (characterId) => {
            const gamesPlayed =
              getCharacterGameCount(
                data,
                characterId
              );

            return {
              id: characterId,

              name:
                getCharacterName(
                  characterData,
                  characterId
                ),

              gamesPlayed,

              wins:
                getCharacterWins(
                  data,
                  characterId
                ),

              top3:
                getCharacterTop3(
                  data,
                  characterId
                ),

              powerRankPoints:
                getCharacterPowerRankPoints(
                  data,
                  characterId
                ),

              adjustedAveragePowerRank:
                getCharacterAdjustedAveragePowerRank(
                  data,
                  characterId
                ),
            };
          }
        );

      characters.sort(
        (a, b) =>
          b.adjustedAveragePowerRank -
          a.adjustedAveragePowerRank
      );

      // ======================================================
      // Games
      // ======================================================

      const gamePaths =
        Object.keys(
          data?.games?.all || {}
        );

      const gameList =
        gamePaths.map(
          (gamePath) => ({
            gamePath,
          })
        );

      // ======================================================
      // State
      // ======================================================

      setLeaderboardPlayers(
        players
      );

      setLeaderboardTeams(
        teams
      );

      setLeaderboardCharacters(
        characters
      );

      setGames(
        gameList
      );

      setTotalPlayerCount(
        playerIds.length
      );

      setTotalTeamCount(
        teamIds.length
      );

      setTotalCharacterCount(
        characterIds.length
      );
    }

    loadData();
  }, [getData]);

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            Loading tournament data...
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // Error
  // ==========================================================

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>
            Failed to load tournament
            data.

            <br />

            {error}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // Database Stats
  // ==========================================================

  const uniqueGameCount =
    games.length;

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section style={styles.hero}>
          <div style={styles.eyebrow}>
            Hero Ultra Rumble
          </div>

          <h1 style={styles.title}>
            The competitive
            <br />
            statistics database.
          </h1>

          <p style={styles.subtitle}>
            Explore player rankings,
            team performances,
            character statistics,
            tournament history, and
            everything in between.
          </p>
        </section>

        {/* ================================================= */}
        {/* DATABASE STATS */}
        {/* ================================================= */}

        <section style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div
              style={
                styles.statNumber
              }
            >
              {formatNumber(
                totalPlayerCount
              )}
            </div>

            <div
              style={
                styles.statLabel
              }
            >
              Players
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={
                styles.statNumber
              }
            >
              {formatNumber(
                totalTeamCount
              )}
            </div>

            <div
              style={
                styles.statLabel
              }
            >
              Teams
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={
                styles.statNumber
              }
            >
              {formatNumber(
                totalCharacterCount
              )}
            </div>

            <div
              style={
                styles.statLabel
              }
            >
              Characters
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={
                styles.statNumber
              }
            >
              {formatNumber(
                uniqueGameCount
              )}
            </div>

            <div
              style={
                styles.statLabel
              }
            >
              Games
            </div>
          </div>

        </section>

        {/* ================================================= */}
        {/* PLAYERS */}
        {/* ================================================= */}

        <Leaderboard
          title="Top Players"
          description="The strongest players by adjusted average power ranking."
          items={
            leaderboardPlayers
          }
          type="player"
        />

        {/* ================================================= */}
        {/* TEAMS */}
        {/* ================================================= */}

        <Leaderboard
          title="Top Teams"
          description="The strongest teams across the database."
          items={
            leaderboardTeams
          }
          type="team"
        />

        {/* ================================================= */}
        {/* CHARACTERS */}
        {/* ================================================= */}

        <Leaderboard
          title="Top Characters"
          description="Characters ranked by their adjusted average performance."
          items={
            leaderboardCharacters
          }
          type="character"
        />

        {/* ================================================= */}
        {/* RECENT GAMES */}
        {/* ================================================= */}

        <section style={styles.section}>
          <div
            style={
              styles.sectionHeader
            }
          >
            <div>
              <h2
                style={
                  styles.sectionTitle
                }
              >
                Recent Games
              </h2>

              <div
                style={
                  styles.sectionDescription
                }
              >
                Recently recorded games in
                the database.
              </div>
            </div>
          </div>

          <div
            style={
              styles.gameGrid
            }
          >
            {games
              .slice()
              .reverse()
              .slice(0, 6)
              .map(
                (game) => (
                  <div
                    key={
                      game.gamePath
                    }
                    style={
                      styles.gameCard
                    }
                  >
                    <div
                      style={
                        styles.gameTitle
                      }
                    >
                      {formatGamePath(
                        game.gamePath
                      )}
                    </div>

                    <div
                      style={
                        styles.gamePath
                      }
                    >
                      {game.gamePath}
                    </div>
                  </div>
                )
              )}

            {!games.length && (
              <div
                style={{
                  color:
                    "var(--muted-color)",
                }}
              >
                No games available.
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}