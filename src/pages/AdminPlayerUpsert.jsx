import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ID,
  tablesDB,
} from "../appwrite.js";

import { useUser } from "../context/UserContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";


const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },


  card: {
    width: "100%",
    maxWidth: 700,
    background: "var(--surface-color)",
    border: "1px solid var(--border-color)",
    borderRadius: 20,
    boxShadow: "0 15px 40px var(--shadow-color)",
    padding: 40,
  },


  back: {
    background: "none",
    border: "none",
    color: "var(--primary)",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    padding: 0,
    marginBottom: 24,
  },


  title: {
    margin: 0,
    marginBottom: 32,
    textAlign: "center",
    fontSize: 32,
    fontWeight: 800,
  },


  avatar: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    margin: "0 auto 30px",
    border: "4px solid var(--border-color)",
  },


  fields: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },


  label: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    fontWeight: 700,
    fontSize: 14,
  },


  input: {
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


  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },


  primary: {
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "var(--primary)",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },


  danger: {
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#d32f2f",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },


  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
  },

};



const AdminPlayerUpsert = () => {


  const { id } = useParams();

  const navigate = useNavigate();


  const { user } = useUser();

  const { refreshPlayers } = usePlayer();



  const isEditMode = Boolean(id);



  const [formData, setFormData] = useState({

    $id: "",
    playerName: "",
    avatar: "",
    userId: "",
    event: "",

  });


  const [loading, setLoading] =
    useState(isEditMode);


  const [saving, setSaving] =
    useState(false);


  const [deleting, setDeleting] =
    useState(false);




  const isAdmin =
    user?.labels?.includes("admin");





  useEffect(() => {

    if (!isAdmin) {

      navigate("/");

      return;

    }


    if (isEditMode) {

      loadPlayer();

    }


  }, [id]);





  async function loadPlayer() {

    try {

      setLoading(true);


      const player =
        await tablesDB.getRow({

          databaseId: "db",

          tableId: "players",

          rowId: id,

        });



      setFormData({

        $id: player.$id ?? "",

        playerName:
          player.playerName ?? "",

        avatar:
          player.avatar ?? "",

        userId:
          player.userId ?? "",

        event:
          player.event ?? "",

      });


    } catch(error) {

      console.error(error);

      alert(
        "Failed loading player."
      );

      navigate("/admin/players");


    } finally {

      setLoading(false);

    }

  }






  function handleChange(field,value) {

    setFormData(prev => ({

      ...prev,

      [field]: value,

    }));

  }






  async function handleSubmit(e) {

    e.preventDefault();


    try {

      setSaving(true);



      const data = {

        playerName:
          formData.playerName,

        avatar:
          formData.avatar,

        userId:
          formData.userId,

        event:
          formData.event || null,

      };



      if(isEditMode) {


        await tablesDB.updateRow({

          databaseId:"db",

          tableId:"players",

          rowId:id,

          data,

        });


        alert("Player updated.");


      } else {


        await tablesDB.createRow({

          databaseId:"db",

          tableId:"players",

          rowId:
            formData.$id.trim()
            ||
            ID.unique(),

          data,

        });


        alert("Player created.");

      }



      await refreshPlayers();

      navigate("/admin/players");


    } catch(error) {

      console.error(error);

      alert(error.message);


    } finally {

      setSaving(false);

    }

  }






  async function handleDelete() {


    if(
      !window.confirm(
        "Delete this player? Game data will remain."
      )
    ) {

      return;

    }



    try {

      setDeleting(true);


      await tablesDB.deleteRow({

        databaseId:"db",

        tableId:"players",

        rowId:id,

      });



      await refreshPlayers();


      navigate("/admin/players");


    } catch(error) {

      console.error(error);

      alert(error.message);


    } finally {

      setDeleting(false);

    }

  }






  if(
    loading ||
    !isAdmin
  ) {

    return (

      <p style={styles.loading}>

        Loading player...

      </p>

    );

  }






  const avatarUrl =

    formData.$id &&
    formData.avatar

    ?

    `https://cdn.discordapp.com/avatars/${formData.$id}/${formData.avatar}.png`

    :

    "/user.png";






  return (

    <main style={styles.page}>


      <section style={styles.card}>


        <button

          style={styles.back}

          onClick={() =>
            navigate("/admin/players")
          }

        >

          ← Back to Players

        </button>




        <h1 style={styles.title}>

          {
            isEditMode
            ? "Edit Player"
            : "Create Player"
          }

        </h1>




        <form onSubmit={handleSubmit}>


          <img

            src={avatarUrl}

            alt="Player Avatar"

            style={styles.avatar}


            onError={(e)=>{

              e.currentTarget.src =
                "/user.png";

            }}

          />





          <div style={styles.fields}>


            <label style={styles.label}>

              PURL User ID

              <input

                style={styles.input}

                value={formData.userId}

                disabled

              />

            </label>




            <label style={styles.label}>

              Discord ID

              <input

                style={styles.input}

                value={formData.$id}

                disabled={isEditMode}

                onChange={(e)=>
                  handleChange(
                    "$id",
                    e.target.value
                  )
                }

                required

              />

            </label>




            <label style={styles.label}>

              In-Game Name

              <input

                style={styles.input}

                value={formData.playerName}

                onChange={(e)=>
                  handleChange(
                    "playerName",
                    e.target.value
                  )
                }

                required

              />

            </label>




            <label style={styles.label}>

              Event ID

              <input

                style={styles.input}

                value={formData.event}

                onChange={(e)=>
                  handleChange(
                    "event",
                    e.target.value
                  )
                }

              />

            </label>




            <label style={styles.label}>

              Avatar Hash

              <input

                style={styles.input}

                value={formData.avatar}

                onChange={(e)=>
                  handleChange(
                    "avatar",
                    e.target.value
                  )
                }

              />

            </label>



          </div>




          <hr style={styles.divider}/>




          <div style={styles.actions}>


            {
              isEditMode && (

                <button

                  type="button"

                  style={styles.danger}

                  onClick={handleDelete}

                  disabled={
                    saving ||
                    deleting
                  }

                >

                  {
                    deleting
                    ? "Deleting..."
                    : "Delete Player"
                  }

                </button>

              )

            }




            <button

              type="submit"

              style={styles.primary}

              disabled={
                saving ||
                deleting
              }

            >

              {
                saving

                ?

                "Saving..."

                :

                isEditMode

                ?

                "Update Player"

                :

                "Create Player"

              }

            </button>


          </div>



        </form>



      </section>



    </main>

  );

};


export default AdminPlayerUpsert;