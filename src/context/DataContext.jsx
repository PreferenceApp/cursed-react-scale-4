import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";

const DataContext = createContext(null);

const emptyTotals = {
    players: {},
    teams: {},
    characters: {},
    relationships: {
        players: {},
        teams: {},
        characters: {},
    },
};

// ============================================================
// Constants
// ============================================================

const PLACEMENT_POINTS = {
    1: 15,
    2: 10,
    3: 8,
    4: 6,
    5: 3,
    6: 2,
    7: 1,
    8: 0,
};

// ============================================================
// Generic Helpers
// ============================================================

const sumValues = (object = {}) => {
    return Object.values(object).reduce(
        (total, value) => total + Number(value || 0),
        0
    );
};

const getPrimaryName = (names = {}) => {
    return (
        Object.entries(names)
            .sort((a, b) => b[1] - a[1])
            .at(0)?.[0] || "Unknown"
    );
};

const getGameCount = (games = {}) => {
    return sumValues(games);
};

const getUniqueGameCount = (games = {}) => {
    return Object.keys(games).length;
};

// ============================================================
// Placement Helpers
// ============================================================

const getPlacementCount = (placementBreakdown = {}, placement) => {
    return Number(placementBreakdown[String(placement)] || 0);
};

const getWins = (placementBreakdown = {}) => {
    return getPlacementCount(placementBreakdown, 1);
};

const getTop3 = (placementBreakdown = {}) => {
    return (
        getPlacementCount(placementBreakdown, 1) +
        getPlacementCount(placementBreakdown, 2) +
        getPlacementCount(placementBreakdown, 3)
    );
};

const getTop5 = (placementBreakdown = {}) => {
    return (
        getPlacementCount(placementBreakdown, 1) +
        getPlacementCount(placementBreakdown, 2) +
        getPlacementCount(placementBreakdown, 3) +
        getPlacementCount(placementBreakdown, 4) +
        getPlacementCount(placementBreakdown, 5)
    );
};

const getAveragePlacement = (placementBreakdown = {}) => {
    let totalPlacement = 0;
    let games = 0;

    Object.entries(placementBreakdown).forEach(([placement, count]) => {
        const p = Number(placement);
        const c = Number(count || 0);

        totalPlacement += p * c;
        games += c;
    });

    return games ? totalPlacement / games : 0;
};

// ============================================================
// Power / Ranking Helpers
// ============================================================

const calculatePenaltyMultiplier = (gamesPlayed = 0) => {
    return Math.min(1.0, 0.1 + gamesPlayed * 0.05);
};

/**
 * Calculates the raw power score from the new schema.
 *
 * Placement points come from placementBreakdown.
 * Knockouts and damage are taken from stats.
 *
 * NOTE:
 * Damage currently uses raw damage directly.
 * If your actual scoring system converts damage into points,
 * change this function in one place.
 */
const getPowerRankPoints = (entity = {}) => {
    const placementBreakdown = entity.placementBreakdown || {};
    const knockouts = entity.stats?.knockouts || 0;
    const damageRaw = entity.stats?.damageRaw || 0;

    const placementPoints = Object.entries(
        placementBreakdown
    ).reduce((total, [placement, count]) => {
        const points = PLACEMENT_POINTS[Number(placement)] || 0;

        return total + points * Number(count || 0);
    }, 0);

    return placementPoints + knockouts + damageRaw;
};

const getAveragePower = (entity = {}) => {
    const gamesPlayed = getGameCount(entity.games);

    if (!gamesPlayed) {
        return 0;
    }

    const power = getPowerRankPoints(entity);

    const baseAverage = power / gamesPlayed;

    return baseAverage * calculatePenaltyMultiplier(gamesPlayed);
};

// ============================================================
// History
// ============================================================

const buildHistory = (games = {}) => {
    const seasons = new Set();
    const regions = new Set();
    const events = new Set();

    const tree = {};

    Object.keys(games).forEach((gamePath) => {
        const parts = gamePath.split("/");

        if (parts.length < 4) {
            return;
        }

        const [season, region, event, gameId] = parts;

        seasons.add(season);
        regions.add(region);
        events.add(event);

        if (!tree[season]) {
            tree[season] = {};
        }

        if (!tree[season][region]) {
            tree[season][region] = {};
        }

        if (!tree[season][region][event]) {
            tree[season][region][event] = [];
        }

        tree[season][region][event].push({
            gameId,
            count: games[gamePath],
            path: gamePath,
        });
    });

    return {
        seasons: seasons.size,
        regions: regions.size,
        events: events.size,
        tree,
    };
};

// ============================================================
// Entity Enrichment
// ============================================================

const enrichEntity = (id, entity = {}) => {
    const gamesPlayed = getGameCount(entity.games);

    const powerRankPoints = getPowerRankPoints(entity);

    return {
        id,

        ...entity,

        primaryName: getPrimaryName(entity.names),

        gamesPlayed,

        uniqueGames: getUniqueGameCount(entity.games),

        powerRankPoints,

        penaltyMultiplier: calculatePenaltyMultiplier(gamesPlayed),

        averagePower: getAveragePower(entity),

        wins: getWins(entity.placementBreakdown),

        top3: getTop3(entity.placementBreakdown),

        top5: getTop5(entity.placementBreakdown),

        averagePlacement: getAveragePlacement(
            entity.placementBreakdown
        ),

        history: buildHistory(entity.games),
    };
};

// ============================================================
// Relationship Helpers
// ============================================================

const getRelationshipIds = (relationshipObject = {}) => {
    return Object.entries(relationshipObject)
        .map(([id, count]) => ({
            id,
            count,
        }))
        .sort((a, b) => b.count - a.count);
};

// ============================================================
// Provider
// ============================================================

export const DataProvider = ({ children }) => {
    const cacheRef = useRef({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ========================================================
    // Load totals.json
    // ========================================================

    const getTotals = useCallback(async (path = "") => {
        const cleanPath = path.replace(/^\/|\/$/g, "");

        if (cacheRef.current[cleanPath]) {
            return cacheRef.current[cleanPath];
        }

        try {
            setLoading(true);
            setError(null);

            const url = `/all/${
                cleanPath ? cleanPath + "/" : ""
            }totals.json`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Could not load ${url}`);
            }

            const data = await response.json();

            cacheRef.current[cleanPath] = data;

            return data;
        } catch (err) {
            console.error(err);

            setError(err.message);

            return emptyTotals;
        } finally {
            setLoading(false);
        }
    }, []);

    // ========================================================
    // Players
    // ========================================================

    const getPlayers = useCallback(
        async (path = "") => {
            const totals = await getTotals(path);

            return Object.entries(totals.players || {})
                .map(([id, player]) =>
                    enrichEntity(id, player)
                )
                .sort(
                    (a, b) =>
                        b.averagePower - a.averagePower
                )
                .map((player, index) => ({
                    ...player,
                    rank: index + 1,
                }));
        },
        [getTotals]
    );

    const getPlayer = useCallback(
        async (id, path = "") => {
            const players = await getPlayers(path);

            return (
                players.find(
                    (player) => player.id === String(id)
                ) || null
            );
        },
        [getPlayers]
    );

    // ========================================================
    // Player Relationships
    // ========================================================

    const getPlayerTeams = useCallback(
        async (playerId, path = "") => {
            const totals = await getTotals(path);

            const relationships =
                totals.relationships?.players?.[playerId]
                    ?.teams || {};

            return getRelationshipIds(relationships);
        },
        [getTotals]
    );

    const getPlayerCharacters = useCallback(
        async (playerId, path = "") => {
            const totals = await getTotals(path);

            const relationships =
                totals.relationships?.players?.[playerId]
                    ?.characters || {};

            return getRelationshipIds(relationships);
        },
        [getTotals]
    );

    // ========================================================
    // Teams
    // ========================================================

    const getTeams = useCallback(
        async (path = "") => {
            const totals = await getTotals(path);

            return Object.entries(totals.teams || {})
                .map(([id, team]) =>
                    enrichEntity(id, team)
                )
                .sort(
                    (a, b) =>
                        b.averagePower - a.averagePower
                )
                .map((team, index) => ({
                    ...team,
                    rank: index + 1,
                }));
        },
        [getTotals]
    );

    const getTeam = useCallback(
        async (id, path = "") => {
            const teams = await getTeams(path);

            return (
                teams.find(
                    (team) => team.id === String(id)
                ) || null
            );
        },
        [getTeams]
    );

    // ========================================================
    // Team Relationships
    // ========================================================

    const getTeamPlayers = useCallback(
        async (teamId, path = "") => {
            const totals = await getTotals(path);

            const relationships =
                totals.relationships?.teams?.[teamId]
                    ?.players || {};

            return getRelationshipIds(relationships);
        },
        [getTotals]
    );

    const getTeamCharacters = useCallback(
        async (teamId, path = "") => {
            const totals = await getTotals(path);

            const relationships =
                totals.relationships?.teams?.[teamId]
                    ?.characters || {};

            return getRelationshipIds(relationships);
        },
        [getTotals]
    );

    const getTeamCharacterCombos = useCallback(
        async (teamId, path = "") => {
            const totals = await getTotals(path);

            const relationships =
                totals.relationships?.teams?.[teamId]
                    ?.charactersCombo || {};

            return getRelationshipIds(relationships);
        },
        [getTotals]
    );

    // ========================================================
    // Characters
    // ========================================================

    const getCharacters = useCallback(
        async (path = "") => {
            const totals = await getTotals(path);

            return Object.entries(
                totals.characters || {}
            )
                .map(([id, character]) =>
                    enrichEntity(id, character)
                )
                .sort(
                    (a, b) =>
                        b.averagePower - a.averagePower
                )
                .map((character, index) => ({
                    ...character,
                    rank: index + 1,
                }));
        },
        [getTotals]
    );

    const getCharacter = useCallback(
        async (id, path = "") => {
            const characters = await getCharacters(path);

            return (
                characters.find(
                    (character) =>
                        character.id === String(id)
                ) || null
            );
        },
        [getCharacters]
    );

    // ========================================================
    // Character Relationships
    // ========================================================

    const getCharacterPlayers = useCallback(
        async (characterId, path = "") => {
            const totals = await getTotals(path);

            const relationships =
                totals.relationships?.characters?.[
                    characterId
                ]?.players || {};

            return getRelationshipIds(relationships);
        },
        [getTotals]
    );

    const getCharacterTeams = useCallback(
        async (characterId, path = "") => {
            const totals = await getTotals(path);

            const relationships =
                totals.relationships?.characters?.[
                    characterId
                ]?.teams || {};

            return getRelationshipIds(relationships);
        },
        [getTotals]
    );

    // ========================================================
    // Games
    // ========================================================

    const getGames = useCallback(
        async (path = "") => {
            const totals = await getTotals(path);

            const gameMap = {};

            const addGames = (entities = {}) => {
                Object.values(entities).forEach(
                    (entity) => {
                        Object.entries(
                            entity.games || {}
                        ).forEach(
                            ([gamePath, count]) => {
                                if (!gameMap[gamePath]) {
                                    gameMap[gamePath] = 0;
                                }

                                gameMap[gamePath] +=
                                    Number(count || 0);
                            }
                        );
                    }
                );
            };

            addGames(totals.players);
            addGames(totals.teams);
            addGames(totals.characters);

            return Object.entries(gameMap)
                .map(([gamePath, count]) => ({
                    gamePath,
                    count,
                }))
                .sort((a, b) =>
                    a.gamePath.localeCompare(
                        b.gamePath,
                        undefined,
                        { numeric: true }
                    )
                );
        },
        [getTotals]
    );

    // ========================================================
    // Clear Cache
    // ========================================================

    const clearCache = useCallback(() => {
        cacheRef.current = {};
    }, []);

    // ========================================================
    // Context
    // ========================================================

    return (
        <DataContext.Provider
            value={{
                loading,
                error,

                // Data
                getTotals,

                // Players
                getPlayers,
                getPlayer,
                getPlayerTeams,
                getPlayerCharacters,

                // Teams
                getTeams,
                getTeam,
                getTeamPlayers,
                getTeamCharacters,
                getTeamCharacterCombos,

                // Characters
                getCharacters,
                getCharacter,
                getCharacterPlayers,
                getCharacterTeams,

                // Games
                getGames,

                // Cache
                clearCache,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

// ============================================================
// Hook
// ============================================================

export const useData = () => {
    const context = useContext(DataContext);

    if (!context) {
        throw new Error(
            "useData must be inside DataProvider"
        );
    }

    return context;
};
