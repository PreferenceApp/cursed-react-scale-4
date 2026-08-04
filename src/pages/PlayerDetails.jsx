import React from "react";
import { useParams } from "react-router-dom";

import { useData } from "../context/DataContext.jsx";


const PlayerDetails = () => {


  const {
    playerId,
    "*": path
  } = useParams();



  const {
    getPlayer,
    loading
  } = useData();




  if(loading){

    return (
      <div>
        Loading player...
      </div>
    );

  }




  const dataPath =
    path
      ? `/${path}`
      : "/all";




  const player =
    getPlayer(
      playerId,
      dataPath
    );





  if(!player){

    return (

      <div>

        Player not found

        <br/>

        ID:
        {" "}
        {playerId}

        <br/>

        Path:
        {" "}
        {dataPath}

      </div>

    );

  }





  const games =
    player.games?.length || 0;



  const averagePower =
    games
      ?
      (
        player.totals.powerRankPoints /
        games
      ).toFixed(2)
      :
      "0";





  const displayName =
    Object.entries(
      player.names || {}
    )
    .sort(
      (a,b)=>b[1]-a[1]
    )[0]?.[0]
    ||
    playerId;





  const characters =
    Object.entries(
      player.characters || {}
    )
    .sort(
      (a,b)=>b[1]-a[1]
    );





  return (

    <div>


      <h1>
        {displayName}
      </h1>



      <p>
        Player ID:
        {" "}
        {playerId}
      </p>



      <p>
        Scope:
        {" "}
        {dataPath}
      </p>




      <hr/>




      <h2>
        Ranking
      </h2>


      <p>
        Rank:
        {" "}
        #{player.rank}
      </p>


      <p>
        Average PowerRank:
        {" "}
        {averagePower}
      </p>


      <p>
        Games Played:
        {" "}
        {games}
      </p>





      <hr/>





      <h2>
        Totals
      </h2>


      <p>
        Placement Points:
        {" "}
        {player.totals.placementPoints || 0}
      </p>


      <p>
        Knockout Points:
        {" "}
        {player.totals.knockoutPoints || 0}
      </p>


      <p>
        Damage:
        {" "}
        {player.totals.damageRaw || 0}
      </p>


      <p>
        PowerRank Points:
        {" "}
        {player.totals.powerRankPoints || 0}
      </p>






      <hr/>





      <h2>
        Characters
      </h2>


      {
        characters.length === 0 && (

          <p>
            No characters found
          </p>

        )
      }



      {
        characters.map(
          ([character,count])=>(

            <div
              key={character}
            >

              {character}
              :
              {" "}
              {count}
              {" "}
              games

            </div>

          )
        )
      }






      <hr/>





      <h2>
        Game History
      </h2>



      {
        player.games?.map(game=>(

          <div
            key={game}
          >

            {game}

          </div>

        ))
      }




    </div>

  );

};


export default PlayerDetails;