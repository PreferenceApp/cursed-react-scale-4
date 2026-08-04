import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";

const DataContext = createContext(null);

// --------------------------------------------------
// Helpers (Mutation-Safe & Lightweight)
// --------------------------------------------------

const emptyTotals = () => ({
    players: {},
    teams: {},
    characters: {},
});

const addNumbers = (a = {}, b = {}) => {
    const result = { ...a };
    for (const [key, value] of Object.entries(b || {})) {
        result[key] = (result[key] || 0) + value;
    }
    return result;
};

const deepCopyStats = (item) => ({
    ...item,
    totals: { ...item.totals },
    names: { ...item.names },
    characters: { ...item.characters },
    games: item.games ? [...item.games] : []
});

// --------------------------------------------------
// Merge Operations
// --------------------------------------------------

const mergeStats = (target, source) => {
    target.totals = addNumbers(target.totals, source.totals);
    target.names = addNumbers(target.names, source.names);
    target.characters = addNumbers(target.characters, source.characters);

    if (source.games?.length) {
        const games = new Set(target.games || []);
        for (const game of source.games) {
            games.add(game);
        }
        target.games = Array.from(games);
    }
};

const mergeCollections = (target, source, mergeFunction) => {
    for (const [id, item] of Object.entries(source || {})) {
        if (!target[id]) {
            target[id] = deepCopyStats(item);
        } else {
            mergeFunction(target[id], item);
        }
    }
};

const mergeCharacters = (target, source) => {
    for (const [id, character] of Object.entries(source || {})) {
        if (!target[id]) {
            target[id] = {
                ...character,
                totals: { ...character.totals },
                games: character.games ? [...character.games] : [],
                players: {}
            };
            mergeCollections(target[id].players, character.players, mergeStats);
            continue;
        }

        target[id].totals = addNumbers(target[id].totals, character.totals);

        if (character.games?.length) {
            const games = new Set(target[id].games || []);
            for (const game of character.games) {
                games.add(game);
            }
            target[id].games = Array.from(games);
        }

        if (!target[id].players) {
            target[id].players = {};
        }

        mergeCollections(target[id].players, character.players, mergeStats);
    }
};

const mergeTotals = (target, source) => {
    mergeCollections(target.players, source.players, mergeStats);
    mergeCollections(target.teams, source.teams, mergeStats);
    mergeCharacters(target.characters, source.characters);
};

// --------------------------------------------------
// Ranking & Leaderboard Formulas
// --------------------------------------------------

const getAveragePower = (entity = {}) => {
    const games = entity.games?.length || 0;
    const points = entity.totals?.powerRankPoints || 0;
    return games ? points / games : 0;
};

const buildRankMap = (collection = {}) => {
    return Object.entries(collection)
        .map(([id, data]) => ({ id, power: getAveragePower(data) }))
        .sort((a, b) => b.power - a.power)
        .reduce((acc, item, index) => {
            acc[item.id] = index + 1;
            return acc;
        }, {});
};

const buildLeaderboard = (collection = {}) => {
    return Object.entries(collection)
        .map(([id, data]) => ({
            id,
            ...data,
            averagePower: getAveragePower(data)
        }))
        .sort((a, b) => b.averagePower - a.averagePower)
        .map((item, index) => ({
            ...item,
            rank: index + 1
        }));
};

const buildRanks = (totals) => ({
    players: buildRankMap(totals.players),
    teams: buildRankMap(totals.teams),
    characters: buildRankMap(totals.characters)
});

// Direct single entity rank calculation helper
const calculateSingleRank = (collection, targetPower) => {
    let rank = 1;
    for (const data of Object.values(collection)) {
        if (getAveragePower(data) > targetPower) {
            rank++;
        }
    }
    return rank;
};

// --------------------------------------------------
// React Context Provider
// --------------------------------------------------

export const DataProvider = ({ children }) => {
    const [games, setGames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const paths = await fetch("/paths.json").then((res) => res.json());
            const results = await Promise.all(
                paths.map(async (path) => {
                    const totals = await fetch(`/all/${path}/totals.json`).then((res) => res.json());
                    return { path, totals };
                })
            );

            const database = {};
            results.forEach((item) => {
                database[item.path] = item.totals;
            });

            setGames(database);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const getGamesForPath = useCallback((path = "/all") => {
        if (path === "/all") {
            return Object.values(games);
        }
        const clean = path.replace("/all", "").split("/").filter(Boolean).join("/");
        return Object.entries(games)
            .filter(([gamePath]) => gamePath.startsWith(clean))
            .map(([_, data]) => data);
    }, [games]);

    const getTotals = useCallback((path = "/all") => {
        const totals = emptyTotals();
        const selected = getGamesForPath(path);
        selected.forEach((game) => {
            mergeTotals(totals, game);
        });
        return totals;
    }, [getGamesForPath]);

    const getLeaderboard = useCallback((type, path = "/all") => {
        const totals = getTotals(path);
        return buildLeaderboard(totals[type]);
    }, [getTotals]);

    const getTopPlayers = useCallback((limit = 5, path = "/all") => {
        return getLeaderboard("players", path).slice(0, limit);
    }, [getLeaderboard]);

    const getTopTeams = useCallback((limit = 5, path = "/all") => {
        return getLeaderboard("teams", path).slice(0, limit);
    }, [getLeaderboard]);

    const getTopCharacters = useCallback((limit = 5, path = "/all") => {
        return getLeaderboard("characters", path).slice(0, limit);
    }, [getLeaderboard]);

    const ranks = useMemo(() => {
        const totals = getTotals("/all");
        return buildRanks(totals);
    }, [getTotals]);

    const getPlayer = useCallback((id, path = "/all") => {
        const totals = getTotals(path);
        const player = totals.players[id];
        if (!player) return null;

        return {
            ...player,
            rank: calculateSingleRank(totals.players, getAveragePower(player))
        };
    }, [getTotals]);

    const getTeam = useCallback((id, path = "/all") => {
        const totals = getTotals(path);
        const team = totals.teams[id];
        if (!team) return null;

        return {
            ...team,
            rank: calculateSingleRank(totals.teams, getAveragePower(team))
        };
    }, [getTotals]);

    const getCharacter = useCallback((id, path = "/all") => {
        const totals = getTotals(path);
        const character = totals.characters[id];
        if (!character) return null;

        return {
            ...character,
            rank: calculateSingleRank(totals.characters, getAveragePower(character))
        };
    }, [getTotals]);

    return (
        <DataContext.Provider
            value={{
                loading,
                error,
                games,
                refreshData: loadData,
                getGamesForPath,
                getTotals,
                getLeaderboard,
                getTopPlayers,
                getTopTeams,
                getTopCharacters,
                getPlayer,
                getTeam,
                getCharacter,
                ranks
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used inside DataProvider");
    }
    return context;
};
