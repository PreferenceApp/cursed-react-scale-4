import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { tablesDB, Query } from "../appwrite.js";

import { useUser } from "../context/UserContext.jsx";


const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },


  card: {
    width: "100%",
    maxWidth: 900,
    background: "var(--surface-color)",
    border: "1px solid var(--border-color)",
    borderRadius: 20,
    boxShadow: "0 15px 40px var(--shadow-color)",
    padding: 40,
  },


  header: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginBottom: 30,
  },


  backButton: {
    background: "none",
    border: "none",
    color: "var(--primary)",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    padding: 0,
    alignSelf: "flex-start",
  },


  title: {
    margin: 0,
    textAlign: "center",
    fontSize: 32,
    fontWeight: 800,
  },


  button: {
    padding: "14px 18px",
    borderRadius: 12,
    border: "none",
    background: "var(--primary)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
    alignSelf: "flex-start",
  },


  search: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid var(--border-color)",
    background: "var(--bg-color)",
    color: "var(--text-color)",
    fontSize: 15,
    outline: "none",
  },


  divider: {
    border: "none",
    borderTop: "1px solid var(--border-color)",
    margin: "30px 0",
  },


  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
  },


  playerCard: {
    background: "var(--bg-color)",
    border: "1px solid var(--border-color)",
    borderRadius: 18,
    padding: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
    cursor: "pointer",
    boxShadow: "0 4px 14px var(--shadow-color)",
    transition: "transform .15s ease, box-shadow .15s ease",
  },


  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid var(--border-color)",
  },


  playerName: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
  },


  message: {
    textAlign: "center",
    color: "var(--muted-color)",
    padding: 30,
    fontSize: 16,
  },

};



const AdminPlayers = () => {


  const navigate = useNavigate();


  const { user } = useUser();



  const [players, setPlayers] = useState([]);

  const [playersLoading, setPlayersLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");



  const isAdmin =
    user?.labels?.includes("admin");




  useEffect(() => {

    if (isAdmin) {

      loadPlayers();

    }

  }, [isAdmin]);





  async function loadPlayers() {

    try {

      setPlayersLoading(true);



      const result =
        await tablesDB.listRows({

          databaseId: "db",

          tableId: "players",

          queries: [

            Query.limit(5000),

            Query.orderDesc("$updatedAt"),

          ],

        });



      setPlayers(result.rows);


    } catch(error) {

      console.error(
        "Failed loading players:",
        error
      );


      setPlayers([]);


    } finally {

      setPlayersLoading(false);

    }

  }





  const filteredPlayers =
    players.filter((player)=>{

      const term =
        search.toLowerCase();



      return (

        player.playerName
          ?.toLowerCase()
          .includes(term)

        ||

        player.$id
          ?.toLowerCase()
          .includes(term)

        ||

        player.userId
          ?.toLowerCase()
          .includes(term)

      );

    });





  if (!isAdmin) {

    return null;

  }





  return (

    <main style={styles.page}>


      <section style={styles.card}>


        <div style={styles.header}>


          <button

            style={styles.backButton}

            onClick={() => navigate("/")}

          >

            ← Back Home

          </button>



          <h1 style={styles.title}>

            Manage Players

          </h1>




          <button

            style={styles.button}

            onClick={() =>
              navigate("/admin/players/create")
            }

          >

            + New Player

          </button>




          <input

            style={styles.search}

            placeholder="Search players..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

          />



        </div>





        <hr style={styles.divider} />





        {
          playersLoading ? (

            <p style={styles.message}>
              Loading players...
            </p>


          ) : filteredPlayers.length === 0 ? (

            <p style={styles.message}>
              No players found.
            </p>


          ) : (


            <div style={styles.grid}>


              {
                filteredPlayers.map((player)=>{


                  const avatar =

                    player.$id &&
                    player.avatar

                    ?

                    `https://cdn.discordapp.com/avatars/${player.$id}/${player.avatar}.png`

                    :

                    "/user.png";




                  return (

                    <article

                      key={player.$id}

                      style={styles.playerCard}


                      onClick={() =>
                        navigate(
                          `/admin/players/${player.$id}`
                        )
                      }



                      onMouseEnter={(e)=>{

                        e.currentTarget.style.transform =
                          "translateY(-4px)";

                        e.currentTarget.style.boxShadow =
                          "0 12px 30px var(--shadow-color)";

                      }}



                      onMouseLeave={(e)=>{

                        e.currentTarget.style.transform =
                          "translateY(0)";

                        e.currentTarget.style.boxShadow =
                          "0 4px 14px var(--shadow-color)";

                      }}

                    >


                      <img

                        src={avatar}

                        alt="Player Avatar"

                        style={styles.avatar}



                        onError={(e)=>{

                          e.currentTarget.src =
                            "/user.png";

                        }}

                      />



                      <h2 style={styles.playerName}>

                        {player.playerName ||
                          "Unknown Player"}

                      </h2>



                    </article>

                  );


                })

              }


            </div>


          )

        }



      </section>


    </main>

  );

};



export default AdminPlayers;