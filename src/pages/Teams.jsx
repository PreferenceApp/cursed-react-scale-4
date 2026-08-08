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
  getTeams,
} from "../data/teams";

export default function Teams() {
  const {
    getData,
    loading,
    error,
  } = useData();

  const {
    "*": path = "",
  } = useParams();

  const [teams, setTeams] =
    useState([]);


  // ==========================================================
  // Load Teams
  // ==========================================================

  useEffect(() => {
    async function loadTeams() {
      const data =
        await getData(path);

      if (!data) {
        setTeams([]);
        return;
      }

      const teams =
        getTeams(data);

      setTeams(teams);
    }

    loadTeams();

  }, [getData, path]);


  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div>
        Loading teams...
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
        Teams
      </h1>

      {teams.map(
        (team) => (
          <div
            key={team.id}
          >

            <div>
              #{team.rank}{" "}
              {team.primaryName}
            </div>

            <div>
              Adjusted Average
              Power Rank:{" "}
              {team.adjustedAveragePowerRank.toFixed(
                2
              )}
            </div>

            <div>
              Games:{" "}
              {team.gamesPlayed}
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

            <hr />

          </div>
        )
      )}

    </div>
  );
}