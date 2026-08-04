import React from "react";
import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";


const CharacterDetails = () => {


  const {
    getTotals
  } = useData();




  const {
    characterId,
    season,
    region,
    event,
    game
  } = useParams();





  // ---------------------------------------------
  // Build path
  // ---------------------------------------------

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







  // ---------------------------------------------
  // Character Leaderboard
  // ---------------------------------------------

  const characters =

    Object.entries(
      totals.characters || {}
    )

    .map(([id,character])=>{


      const games =
        character.games?.length || 0;


      const power =
        character.totals?.powerRankPoints || 0;



      return {

        id,

        ...character,

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







  const selectedCharacter =

    characters.find(
      character =>
        character.id === characterId
    );






  if(!selectedCharacter){


    return (

      <div>

        <h1>
          Character Not Found
        </h1>


        <p>
          Character ID:
          {" "}
          {characterId}
        </p>


        <p>
          Scope:
          {" "}
          {path}
        </p>


      </div>

    );

  }







  // ---------------------------------------------
  // Players using this Character
  // ---------------------------------------------

  const characterPlayers =

    Object.entries(
      selectedCharacter.players || {}
    )

    .map(([id,player])=>{


      const games =
        player.games?.length || 0;


      const power =
        player.totals?.powerRankPoints || 0;



      return {

        id,

        ...player,

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








  // ---------------------------------------------
  // All Players
  // ---------------------------------------------

  const players =

    Object.entries(
      totals.players || {}
    )

    .map(([id,player])=>{


      const games =
        player.games?.length || 0;


      const power =
        player.totals?.powerRankPoints || 0;



      return {

        id,

        ...player,

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









  return (

    <div>


      <h1>
        Character Details
      </h1>



      <p>
        Scope:
        {" "}
        {path}
      </p>





      <hr />






      {/* Selected Character */}

      <h2>
        Character Rank:
        {" "}
        #{characters.indexOf(selectedCharacter)+1}
      </h2>




      <h3>
        Character ID:
        {" "}
        {selectedCharacter.id}
      </h3>



      <div>
        Games:
        {" "}
        {selectedCharacter.games?.length || 0}
      </div>



      <div>
        Power Rank:
        {" "}
        {
          selectedCharacter.totals?.powerRankPoints || 0
        }
      </div>



      <div>
        Average:
        {" "}
        {selectedCharacter.average.toFixed(2)}
      </div>








      {/* Players Using Character */}

      <h2>
        Players Using This Character
      </h2>



      {
        characterPlayers.map((player,index)=>(


          <div
            key={player.id}
            style={{
              padding:"10px",
              borderBottom:"1px solid #ccc"
            }}
          >


            <strong>

              #{index+1}
              {" "}
              Player:
              {" "}
              {player.id}

            </strong>



            <div>
              Games:
              {" "}
              {player.games?.length || 0}
            </div>



            <div>
              Power Rank:
              {" "}
              {player.totals?.powerRankPoints || 0}
            </div>



            <div>
              Average:
              {" "}
              {player.average.toFixed(2)}
            </div>


          </div>


        ))
      }








      {/* All Players */}

      <h2>
        All Players
      </h2>



      {
        players.map((player,index)=>(


          <div
            key={player.id}
            style={{
              padding:"10px",
              borderBottom:"1px solid #ccc"
            }}
          >


            <strong>

              #{index+1}
              {" "}
              {player.id}

            </strong>



            <div>
              Games:
              {" "}
              {player.games?.length || 0}
            </div>



            <div>
              Power Rank:
              {" "}
              {player.totals?.powerRankPoints || 0}
            </div>



            <div>
              Average:
              {" "}
              {player.average.toFixed(2)}
            </div>


          </div>


        ))
      }









      {/* All Characters */}

      <h2>
        All Characters
      </h2>



      {
        characters.map((character,index)=>(


          <div
            key={character.id}
            style={{
              padding:"10px",
              borderBottom:"1px solid #ccc"
            }}
          >


            <strong>

              #{index+1}
              {" "}
              {character.id}

            </strong>



            <div>
              Games:
              {" "}
              {character.games?.length || 0}
            </div>



            <div>
              Power Rank:
              {" "}
              {character.totals?.powerRankPoints || 0}
            </div>



            <div>
              Average:
              {" "}
              {character.average.toFixed(2)}
            </div>


          </div>


        ))
      }





    </div>

  );


};


export default CharacterDetails;