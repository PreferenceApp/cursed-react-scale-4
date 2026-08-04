import React from "react";
import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";


const TeamDetails = () => {


  const {
    getTotals
  } = useData();



  const {
    teamId,
    season,
    region,
    event,
    game
  } = useParams();




  // Build scope path

  let path = "/all";


  if(season)
    path += `/${season}`;

  if(region)
    path += `/${region}`;

  if(event)
    path += `/${event}`;

  if(game)
    path += `/${game}`;





  const totals =
    getTotals(path);





  const teams =
    Object.entries(
      totals.teams
    )

    .map(([id,team])=>{


      const games =
        team.games?.length || 0;


      const power =
        team.totals?.powerRankPoints || 0;



      return {

        id,

        ...team,

        average:
          games
            ? power / games
            : 0

      };


    })

    .sort(
      (a,b)=>
        b.average - a.average
    );





  const selectedTeam =
    teams.find(
      team =>
        team.id === teamId
    );






  if(!selectedTeam){

    return (

      <div>

        <h1>
          Team Not Found
        </h1>

        <p>
          Team ID: {teamId}
        </p>

        <p>
          Scope: {path}
        </p>

      </div>

    );

  }






  return (

    <div>


      <h1>
        Team Details
      </h1>


      <p>
        Scope: {path}
      </p>



      <hr />



      <h2>
        Rank #{teams.indexOf(selectedTeam)+1}
      </h2>



      <h3>
        Team ID: {selectedTeam.id}
      </h3>



      <div>
        Games Played:
        {" "}
        {selectedTeam.games?.length || 0}
      </div>



      <div>
        Power Rank Total:
        {" "}
        {
          selectedTeam.totals?.powerRankPoints || 0
        }
      </div>



      <div>
        Power Rank Average:
        {" "}
        {
          selectedTeam.average.toFixed(2)
        }
      </div>




      <h2>
        All Teams
      </h2>




      {
        teams.map((team,index)=>(


          <div
            key={team.id}
            style={{
              padding:"10px",
              borderBottom:"1px solid #ccc"
            }}
          >


            <strong>
              #{index+1}
              {" "}
              {team.id}
            </strong>


            <div>
              Average:
              {" "}
              {team.average.toFixed(2)}
            </div>


            <div>
              Games:
              {" "}
              {team.games?.length || 0}
            </div>


          </div>


        ))
      }



    </div>

  );


};


export default TeamDetails;