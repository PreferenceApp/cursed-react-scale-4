import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  useData,
} from "../context/DataContext";

import {
  getCharacter,
} from "../data/characters";

import {
  getCharacterPlayers,
  getCharacterTeams,
} from "../data/relationships";


export default function Character({
  path = "",
}) {
  const {
    characterId,
  } = useParams();

  const {
    getData,
    loading,
    error,
  } = useData();


  // ==========================================================
  // State
  // ==========================================================

  const [
    character,
    setCharacter,
  ] = useState(null);

  const [
    players,
    setPlayers,
  ] = useState([]);

  const [
    teams,
    setTeams,
  ] = useState([]);


  // ==========================================================
  // Load Character
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadCharacter() {
      try {
        const data =
          await getData(path);

        if (!data) {
          if (cancelled) return;

          setCharacter(null);
          setPlayers([]);
          setTeams([]);

          return;
        }

        const foundCharacter =
          getCharacter(
            data,
            characterId
          );

        console.log(
          "Character ID:",
          characterId
        );

        console.log(
          "Character Data:",
          foundCharacter
        );

        if (!foundCharacter) {
          if (cancelled) return;

          setCharacter(null);
          setPlayers([]);
          setTeams([]);

          return;
        }

        const characterPlayers =
          getCharacterPlayers(
            data,
            characterId
          );

        const characterTeams =
          getCharacterTeams(
            data,
            characterId
          );

        if (cancelled) return;

        setCharacter(
          foundCharacter
        );

        setPlayers(
          characterPlayers || []
        );

        setTeams(
          characterTeams || []
        );

      } catch (err) {
        console.error(
          "Failed to load character:",
          err
        );

        if (cancelled) return;

        setCharacter(null);
        setPlayers([]);
        setTeams([]);
      }
    }

    loadCharacter();

    return () => {
      cancelled = true;
    };

  }, [
    getData,
    characterId,
    path,
  ]);


  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div>
        Loading character...
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

  if (!character) {
    return (
      <div>
        Character not found.
      </div>
    );
  }


  // ==========================================================
  // Safe Values
  // ==========================================================

  const adjustedAveragePowerRank =
    Number(
      character.adjustedAveragePowerRank || 0
    );

  const averagePowerRank =
    Number(
      character.averagePowerRank || 0
    );

  const penaltyMultiplier =
    Number(
      character.penaltyMultiplier || 0
    );

  const averagePlacement =
    Number(
      character.averagePlacement || 0
    );


  // ==========================================================
  // Page
  // ==========================================================

  return (
    <div>

      {/* =====================================================
          Character Header
      ===================================================== */}

{/* =====================================================
    Character Header
===================================================== */}

<div>

  <img
    src={character.imagePath}
    alt={character.name}
    style={{
      width: "150px",
      height: "150px",
      objectFit: "contain",
    }}
  />

  <h1>
    {character.name}
  </h1>

  <div>
    ID:{" "}
    {character.id}
  </div>

  <div>
    Rank: #
    {character.rank ?? "—"}
  </div>

</div>


      {/* =====================================================
          Performance
      ===================================================== */}

      <h2>
        Performance
      </h2>

      <div>
        Adjusted Average Power Rank:{" "}
        {adjustedAveragePowerRank.toFixed(2)}
      </div>

      <div>
        Average Power Rank:{" "}
        {averagePowerRank.toFixed(2)}
      </div>

      <div>
        Power Rank Points:{" "}
        {character.powerRankPoints ?? 0}
      </div>

      <div>
        Placement Points:{" "}
        {character.placementPoints ?? 0}
      </div>

      <div>
        Knockout Points:{" "}
        {character.knockoutPoints ?? 0}
      </div>

      <div>
        Damage Points:{" "}
        {character.damagePoints ?? 0}
      </div>

      <div>
        Damage:{" "}
        {character.damageRaw ?? 0}
      </div>

      <div>
        Games Played:{" "}
        {character.gamesPlayed ?? 0}
      </div>

      <div>
        Unique Games:{" "}
        {character.uniqueGames ?? 0}
      </div>

      <div>
        Penalty Multiplier:{" "}
        {penaltyMultiplier.toFixed(2)}
      </div>


      {/* =====================================================
          Placement Stats
      ===================================================== */}

      <h2>
        Placements
      </h2>

      <div>
        Wins:{" "}
        {character.wins ?? 0}
      </div>

      <div>
        Top 3:{" "}
        {character.top3 ?? 0}
      </div>

      <div>
        Top 5:{" "}
        {character.top5 ?? 0}
      </div>

      <div>
        Average Placement:{" "}
        {averagePlacement.toFixed(2)}
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

    </div>
  );
}