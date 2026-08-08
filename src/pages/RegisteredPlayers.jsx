import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
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

  button: {
    padding: "14px 18px",
    borderRadius: 12,
    border: "none",
    background: "var(--primary)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
    alignSelf: "flex-start",
  },

  divider: {
    border: "none",
    borderTop: "1px solid var(--border-color)",
    margin: "30px 0",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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

  loading: {
    textAlign: "center",
    color: "var(--muted-color)",
    padding: 30,
    fontSize: 16,
  },
};


const RegisteredPlayers = () => {

  const navigate = useNavigate();

  const { events } = useEvents();


  const [search, setSearch] = useState("");



  const filteredPlayers = players.filter((player) => {

    const term = search.toLowerCase();


    return (
      player.playerName
        ?.toLowerCase()
        .includes(term)
    );

  });




  function handlePlayerClick(player) {

         navigate(`/players/${player.$id}`);

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

            {event?.eventName || "Registered Players"}

          </h1>

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

            <p style={styles.loading}>

              Loading players...

            </p>


          ) : filteredPlayers.length === 0 ? (

            <p style={styles.loading}>

              No players found.

            </p>


          ) : (


            <div style={styles.grid}>


              {
                filteredPlayers.map((player) => {


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
                        handlePlayerClick(player)
                      }


                      onMouseEnter={(e) => {

                        e.currentTarget.style.transform =
                          "translateY(-4px)";

                        e.currentTarget.style.boxShadow =
                          "0 12px 30px var(--shadow-color)";

                      }}


                      onMouseLeave={(e) => {

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


                        onError={(e) => {

                          e.currentTarget.src =
                            "/user.png";

                        }}

                      />



                      <h2 style={styles.playerName}>

                        {player.playerName || "Unknown Player"}

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



export default RegisteredPlayers;