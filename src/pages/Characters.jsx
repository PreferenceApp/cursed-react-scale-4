import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import { useData } from "../context/DataContext";

import {
  getCharacters,
} from "../data/characters";


// ============================================================
// Characters
// ============================================================

export default function Characters() {
  const {
    getData,
    loading,
    error,
  } = useData();

  const location =
    useLocation();

  const [characters, setCharacters] =
    useState([]);


  // ==========================================================
  // Get Path From URL
  // ==========================================================

  const path =
    location.pathname
      .replace(/^\/characters/, "")
      .replace(/^\/+|\/+$/g, "");


  // ==========================================================
  // Load Characters
  // ==========================================================

  useEffect(() => {
    async function loadCharacters() {
      const data =
        await getData(path);

      if (!data) {
        setCharacters([]);
        return;
      }

      const characters =
        getCharacters(data);

      setCharacters(characters);
    }

    loadCharacters();
  }, [getData, path]);


  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div>
        Loading characters...
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
        Characters
      </h1>


      {/* =====================================================
          Current Filter
          ===================================================== */}

      <div>
        Filter:{" "}
        {path
          ? path
          : "All"}
      </div>


      {/* =====================================================
          Character List
          ===================================================== */}

      {characters.length === 0 ? (
        <div>
          No characters found.
        </div>
      ) : (

characters.map((character) => (
  <div key={character.id}>

    <div>
      #{character.rank}{" "}
      {character.name}
    </div>

    <img
      src={character.imagePath}
      alt={character.name}
      width="100"
      height="100"
    />

    <div>
      Adjusted Average Power Rank:{" "}
      {Number(
        character.adjustedAveragePowerRank || 0
      ).toFixed(2)}
    </div>

    <div>
      Games: {character.gamesPlayed}
    </div>

    <div>
      Wins: {character.wins}
    </div>

    <div>
      Top 3: {character.top3}
    </div>

    <div>
      Top 5: {character.top5}
    </div>

    <div>
      Average Placement:{" "}
      {Number(
        character.averagePlacement || 0
      ).toFixed(2)}
    </div>

    <hr />

  </div>
))

      )}

    </div>
  );
}