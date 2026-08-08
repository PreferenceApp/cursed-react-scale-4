import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { useData } from "../context/DataContext";

import {
  getPlayers,
} from "../data/players";


export default function Players() {
  const {
    getData,
    loading,
    error,
  } = useData();

  const {
    "*": path = "",
  } = useParams();

  const [players, setPlayers] =
    useState([]);


  // ==========================================================
  // Load Players
  // ==========================================================

  useEffect(() => {
    async function loadPlayers() {
      const data =
        await getData(path);

      if (!data) {
        setPlayers([]);
        return;
      }

      const players =
        getPlayers(data);

      setPlayers(players);
    }

    loadPlayers();
  }, [getData, path]);


  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div>
        Loading players...
      </div>
    );
  }


  // ==========================================================
  // Error
  // ==========================================================

  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }


  // ==========================================================
  // Page
  // ==========================================================

  return (
    <div>
      <h1>
        Players
      </h1>

      {players.map(
        (player) => (
          <div
            key={player.id}
          >
            <div>
              #{player.rank}{" "}
              {player.primaryName}
            </div>

            <div>
              Adjusted Average
              Power Rank:{" "}
              {player.adjustedAveragePowerRank.toFixed(
                2
              )}
            </div>

            <div>
              Games:{" "}
              {player.gamesPlayed}
            </div>

            <div>
              Wins:{" "}
              {player.wins}
            </div>

            <div>
              Top 3:{" "}
              {player.top3}
            </div>

            <div>
              Top 5:{" "}
              {player.top5}
            </div>

            <hr />
          </div>
        )
      )}
    </div>
  );
}