import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const DataContext = createContext(null);
const emptyTotals = { players: {}, teams: {}, characters: {} };

// ---------------------------------------------
// Helpers
// ---------------------------------------------
const getPrimaryName = (names = {}) => {
  return Object.entries(names)
    .sort((a, b) => b[1] - a[1])
    .at(0)?.[0] || "Unknown";
};

const calculatePenaltyMultiplier = (gamesPlayed = 0) => {
  return Math.min(1.00, 0.10 + (gamesPlayed * 0.05));
};

const getAveragePower = (entity = {}) => {
  const games = entity.games?.length || 0;
  const power = entity.totals?.powerRankPoints || 0;
  const baseAverage = games ? power / games : 0;
  return baseAverage * calculatePenaltyMultiplier(games);
};

const buildHistory = (games = []) => {
  const seasons = new Set();
  const regions = new Set();
  const events = new Set();
  const tree = {};

  games.forEach(game => {
    const parts = game.split("/");
    if (parts.length >= 4) {
      const [season, region, event, gameId] = parts;
      seasons.add(season);
      regions.add(region);
      events.add(event);

      if (!tree[season]) tree[season] = {};
      if (!tree[season][region]) tree[season][region] = {};
      if (!tree[season][region][event]) tree[season][region][event] = [];
      tree[season][region][event].push(gameId);
    }
  });

  return { seasons: seasons.size, regions: regions.size, events: events.size, tree };
};

const enrichEntity = (id, entity = {}) => {
  const gamesPlayed = entity.games?.length || 0;
  return {
    id,
    ...entity,
    primaryName: getPrimaryName(entity.names),
    gamesPlayed,
    penaltyMultiplier: calculatePenaltyMultiplier(gamesPlayed),
    averagePower: getAveragePower(entity),
    history: buildHistory(entity.games)
  };
};

// ---------------------------------------------
// Provider
// ---------------------------------------------
export const DataProvider = ({ children }) => {
  // Use a Ref for the network cache to completely bypass closure stale-state issues
  const cacheRef = useRef({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -----------------------------------------
  // Load totals.json (Fixed cache read/write)
  // -----------------------------------------
  const getTotals = useCallback(async (path = "") => {
    const cleanPath = path.replace(/^\/|\/$/g, "");

    // 1. Synchronously read from the ref cache
    if (cacheRef.current[cleanPath]) {
      return cacheRef.current[cleanPath];
    }

    try {
      setLoading(true);
      setError(null);
      
      const url = `/all/${cleanPath ? cleanPath + "/" : ""}totals.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load ${url}`);
      
      const data = await response.json();
      
      // 2. Synchronously write to the ref cache
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

  // -----------------------------------------
  // Players
  // -----------------------------------------
  const getPlayers = useCallback(async (path = "") => {
    const totals = await getTotals(path);
    return Object.entries(totals.players)
      .map(([id, player]) => enrichEntity(id, player))
      .sort((a, b) => b.averagePower - a.averagePower)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }, [getTotals]);

  const getPlayer = useCallback(async (id, path = "") => {
    const players = await getPlayers(path);
    return players.find(p => p.id === id) || null;
  }, [getPlayers]);

  // -----------------------------------------
  // Teams
  // -----------------------------------------
  const getTeams = useCallback(async (path = "") => {
    const totals = await getTotals(path);
    return Object.entries(totals.teams)
      .map(([id, team]) => enrichEntity(id, team))
      .sort((a, b) => b.averagePower - a.averagePower)
      .map((team, index) => ({ ...team, rank: index + 1 }));
  }, [getTotals]);

  const getTeam = useCallback(async (id, path = "") => {
    const teams = await getTeams(path);
    return teams.find(t => t.id === id) || null;
  }, [getTeams]);

  // -----------------------------------------
  // Characters
  // -----------------------------------------
  const getCharacters = useCallback(async (path = "") => {
    const totals = await getTotals(path);
    return Object.entries(totals.characters)
      .map(([id, char]) => enrichEntity(id, char))
      .sort((a, b) => b.averagePower - a.averagePower)
      .map((char, index) => ({ ...char, rank: index + 1 }));
  }, [getTotals]);

  const getCharacter = useCallback(async (id, path = "") => {
    const chars = await getCharacters(path);
    return chars.find(c => c.id === id) || null;
  }, [getCharacters]);

  return (
    <DataContext.Provider value={{ 
      loading, 
      error, 
      getTotals, 
      getPlayers, 
      getPlayer, 
      getTeams, 
      getTeam, 
      getCharacters, 
      getCharacter 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be inside DataProvider");
  return context;
};
