import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { useData } from "../context/DataContext";

import {
  getTeam,
} from "../data/teams";

import {
  getTeamPlayers,
  getTeamCharacters,
  getTeamCharacterCombos,
} from "../data/relationships";


export default function Team({
  path = "",
}) {
  const { teamId } = useParams();

  const {
    getData,
    loading,
    error,
  } = useData();

  const [team, setTeam] =
    useState(null);

  const [players, setPlayers] =
    useState([]);

  const [characters, setCharacters] =
    useState([]);

  const [characterCombos, setCharacterCombos] =
    useState([]);


  // ==========================================================
  // Load Team
  // ==========================================================

  useEffect(() => {
    async function loadTeam() {
      const data =
        await getData(path);

      if (!data) {
        setTeam(null);
        return;
      }

      const team =
        getTeam(
          data,
          teamId
        );

      if (!team) {
        setTeam(null);
        setPlayers([]);
        setCharacters([]);
        setCharacterCombos([]);
        return;
      }

      setTeam(team);

      setPlayers(
        getTeamPlayers(
          data,
          teamId
        )
      );

      setCharacters(
        getTeamCharacters(
          data,
          teamId
        )
      );

      setCharacterCombos(
        getTeamCharacterCombos(
          data,
          teamId
        )
      );
    }

    loadTeam();
  }, [
    getData,
    teamId,
    path,
  ]);


  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div>
        Loading team...
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

  if (!team) {
    return (
      <div>
        Team not found.
      </div>
    );
  }


  // ==========================================================
  // Page
  // ==========================================================

  return (
    <div>
      <h1>
        {team.primaryName}
      </h1>

      <div>
        Rank: #{team.rank}
      </div>

      <div>
        Adjusted Average Power Rank:{" "}
        {team.adjustedAveragePowerRank.toFixed(
          2
        )}
      </div>

      <div>
        Average Power Rank:{" "}
        {team.averagePowerRank.toFixed(
          2
        )}
      </div>

      <div>
        Power Rank Points:{" "}
        {team.powerRankPoints}
      </div>

      <div>
        Games Played:{" "}
        {team.gamesPlayed}
      </div>

      <div>
        Penalty Multiplier:{" "}
        {team.penaltyMultiplier.toFixed(
          2
        )}
      </div>

      <div>
        Wins:{" "}
        {team.wins}
      </div>

      <div>
        Top 3:{" "}
        {team.top3}
      </div>

      <div>
        Top 5:{" "}
        {team.top5}
      </div>

      <div>
        Average Placement:{" "}
        {team.averagePlacement.toFixed(
          2
        )}
      </div>


      {/* =====================================================
          Players
      ===================================================== */}

      <h2>
        Players
      </h2>

      {players.length === 0 ? (
        <div>
          No players found.
        </div>
      ) : (
        players.map(
          (player) => (
            <div
              key={player.id}
            >
              {player.id}

              {" — "}

              {player.count}
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


      {/* =====================================================
          Character Combos
      ===================================================== */}

      <h2>
        Character Combos
      </h2>

      {characterCombos.length === 0 ? (
        <div>
          No character combos found.
        </div>
      ) : (
        characterCombos.map(
          (combo) => (
            <div
              key={combo.id}
            >
              {combo.id}

              {" — "}

              {combo.count}
            </div>
          )
        )
      )}
    </div>
  );
}