import React, { useMemo } from "react";
import { useData } from "../context/DataContext.jsx";


const styles = {

  page:{
    minHeight:"100vh",
    padding:"40px 20px",
    background:"var(--bg-color)",
  },


  container:{
    maxWidth:"1400px",
    margin:"0 auto",
  },


  title:{
    textAlign:"center",
    marginBottom:"40px",
  },


  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(350px,1fr))",
    gap:"30px",
  },


  card:{
    background:"var(--surface-color)",
    padding:"25px",
    borderRadius:"12px",
  },


  row:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"10px 0",
    borderBottom:"1px solid rgba(255,255,255,.1)",
  },


  rank:{
    width:"35px",
    fontWeight:"bold",
  },


  name:{
    flex:1,
  },


  power:{
    fontWeight:"bold",
  },


  characterCard:{
    background:"var(--surface-color)",
    padding:"25px",
    borderRadius:"12px",
  },


};





const getPower = (entity)=>{


  return (

    entity?.totals?.powerRankPoints || 0

  ) /

  (

    entity?.games?.length || 1

  );

};





const getTop = (
  collection={},
  amount=5
)=>{


  return Object.entries(collection)

    .map(([id,data])=>({

      id,

      ...data,

      power:
        getPower(data)

    }))


    .sort(
      (a,b)=>
        b.power-a.power
    )


    .slice(
      0,
      amount
    );

};





const getTopCharacters = (
  characters={}
)=>{


  return Object.entries(characters)

    .map(([id,character])=>{


      const topPlayers =

        getTop(
          character.players || {},
          5
        );



      return {

        id,

        ...character,

        power:
          getPower(character),

        topPlayers

      };


    })


    .sort(
      (a,b)=>
        b.power-a.power
    )


    .slice(
      0,
      5
    );


};







const Games = ()=>{


  const {
    getTotals,
    loading
  } = useData();




  const data = useMemo(()=>{


    const totals =
      getTotals("/all");



    return {

      players:
        getTop(
          totals.players,
          5
        ),


      teams:
        getTop(
          totals.teams,
          5
        ),


      characters:
        getTopCharacters(
          totals.characters
        )

    };


  },[
    getTotals
  ]);





  if(loading){

    return (

      <div style={styles.page}>
        Loading...
      </div>

    );

  }





  return (

    <div style={styles.page}>


      <div style={styles.container}>


        <h1 style={styles.title}>
          Leaderboard
        </h1>




        <div style={styles.grid}>


          {/* PLAYERS */}

          <div style={styles.card}>


            <h2>
              Top 5 Players
            </h2>



            {
              data.players.map(
                (player,index)=>(

                  <div
                    key={player.id}
                    style={styles.row}
                  >

                    <span style={styles.rank}>
                      #{index+1}
                    </span>


                    <span style={styles.name}>

                      {
                        Object.keys(
                          player.names || {}
                        )[0]
                        ||
                        player.id
                      }

                    </span>


                    <span style={styles.power}>

                      {
                        player.power.toFixed(2)
                      }

                    </span>


                  </div>

                )
              )
            }


          </div>





          {/* TEAMS */}

          <div style={styles.card}>


            <h2>
              Top 5 Teams
            </h2>



            {
              data.teams.map(
                (team,index)=>(

                  <div
                    key={team.id}
                    style={styles.row}
                  >

                    <span style={styles.rank}>
                      #{index+1}
                    </span>


                    <span style={styles.name}>
                      {team.id}
                    </span>


                    <span style={styles.power}>
                      {team.power.toFixed(2)}
                    </span>


                  </div>

                )
              )
            }


          </div>



        </div>






        {/* CHARACTERS */}


        <h2 style={{marginTop:"50px"}}>
          Top 5 Characters
        </h2>



        <div style={styles.grid}>


          {
            data.characters.map(
              (character)=>(


                <div
                  key={character.id}
                  style={styles.characterCard}
                >


                  <h2>
                    {character.id}
                  </h2>


                  <div>
                    PowerRank:
                    {" "}
                    {
                      character.power.toFixed(2)
                    }
                  </div>




                  <h3>
                    Best Players
                  </h3>




                  {
                    character.topPlayers.map(
                      (player,index)=>(


                        <div
                          key={player.id}
                          style={styles.row}
                        >

                          <span style={styles.rank}>
                            #{index+1}
                          </span>


                          <span style={styles.name}>

                            {
                              Object.keys(
                                player.names || {}
                              )[0]
                              ||
                              player.id
                            }

                          </span>


                          <span style={styles.power}>

                            {
                              player.power.toFixed(2)
                            }

                          </span>


                        </div>


                      )
                    )
                  }



                </div>


              )
            )
          }



        </div>



      </div>


    </div>

  );


};


export default Games;