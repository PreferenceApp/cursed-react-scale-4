import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { useData } from "../context/DataContext";

import {
  getPlayer,
} from "../data/players";

import {
  getPlayerTeams,
  getPlayerCharacters,
} from "../data/relationships";


export default function Player({
  path = "",
}) {
  const { playerId } = useParams();

  const {
    getData,
    loading,
    error,
  } = useData();

  const [player, setPlayer] =
    useState(null);

  const [teams, setTeams] =
    useState([]);

  const [characters, setCharacters] =
    useState([]);


  // ==========================================================
  // Load Player
  // ==========================================================

  useEffect(() => {
    async function loadPlayer() {
      const data =
        await getData(path);

      if (!data) {
        setPlayer(null);
        return;
      }

      const player =
        getPlayer(
          data,
          playerId
        );

      if (!player) {
        setPlayer(null);
        setTeams([]);
        setCharacters([]);
        return;
      }

      setPlayer(player);

      setTeams(
        getPlayerTeams(
          data,
          playerId
        )
      );

      setCharacters(
        getPlayerCharacters(
          data,
          playerId
        )
      );
    }

    loadPlayer();
  }, [
    getData,
    playerId,
    path,
  ]);


  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div>
        Loading player...
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
  // Not Found
  // ==========================================================

  if (!player) {
    return (
      <div>
        Player not found.
      </div>
    );
  }


  // ==========================================================
  // Page
  // ==========================================================

  return (
    <div>
      <h1>
        {player.primaryName}
      </h1>

      <div>
        Rank: #{player.rank}
      </div>

      <div>
        Adjusted Average Power Rank:{" "}
        {player.adjustedAveragePowerRank.toFixed(
          2
        )}
      </div>

      <div>
        Average Power Rank:{" "}
        {player.averagePowerRank.toFixed(
          2
        )}
      </div>

      <div>
        Power Rank Points:{" "}
        {player.powerRankPoints}
      </div>

      <div>
        Games Played:{" "}
        {player.gamesPlayed}
      </div>

      <div>
        Penalty Multiplier:{" "}
        {player.penaltyMultiplier.toFixed(
          2
        )}
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

      <div>
        Average Placement:{" "}
        {player.averagePlacement.toFixed(
          2
        )}
      </div>


      {/* =====================================================
          Teams
      ===================================================== */}

      <h2>
        Teams
      </h2>

      {teams.length === 0 ? (
        <div>
          No teams found.
        </div>
      ) : (
        teams.map(
          (team) => (
            <div
              key={team.id}
            >
              {team.id}

              {" — "}

              {team.count}
            </div>
          )
        )
      )}


      {/* =====================================================
          Characters
      ===================================================== */}

      <h2>
        Characters
      </h2>

      {characters.length === 0 ? (
        <div>
          No characters found.
        </div>
      ) : (
        characters.map(
          (character) => (
            <div
              key={character.id}
            >
              {character.id}

              {" — "}

              {character.count}
            </div>
          )
        )
      )}
    </div>
  );
}