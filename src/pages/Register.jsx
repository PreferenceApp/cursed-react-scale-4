import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEvents } from "../context/EventsContext.jsx";
import { useUser } from "../context/UserContext.jsx";


const styles = {

  page:{
    minHeight:"100vh",
    display:"flex",
    justifyContent:"center",
    padding:"40px 20px",
    background:"var(--bg-color)",
  },


  card:{
    width:"100%",
    maxWidth:"650px",
    padding:"40px",
    borderRadius:"24px",
    background:"var(--surface-color)",
    border:"1px solid var(--border-color)",
    boxShadow:"0 20px 50px var(--shadow-color)",
  },


  header:{
    textAlign:"center",
    marginBottom:"30px",
  },


  backButton:{
    border:"none",
    background:"transparent",
    color:"var(--primary)",
    cursor:"pointer",
    fontWeight:700,
    fontSize:"1rem",
    marginBottom:"20px",
  },


  title:{
    margin:0,
    fontSize:"2rem",
    fontWeight:800,
    color:"var(--text-color)",
  },


  status:{
    padding:"15px",
    borderRadius:"12px",
    textAlign:"center",
    fontWeight:700,
    marginBottom:"25px",
  },


  registered:{
    background:"var(--success-bg)",
    color:"var(--success-text)",
  },


  unregistered:{
    background:"var(--danger-bg)",
    color:"var(--danger-text)",
  },


  fields:{
    display:"flex",
    flexDirection:"column",
    gap:"20px",
    marginBottom:"25px",
  },


  label:{
    display:"flex",
    flexDirection:"column",
    gap:"8px",
    fontWeight:700,
    color:"var(--text-color)",
  },


  input:{
    width:"100%",
    padding:"12px 14px",
    borderRadius:"10px",
    border:"1px solid var(--border-color)",
    background:"var(--bg-color)",
    color:"var(--text-color)",
    fontSize:"1rem",
  },


  select:{
    width:"100%",
    padding:"12px 14px",
    borderRadius:"10px",
    border:"1px solid var(--border-color)",
    background:"var(--bg-color)",
    color:"var(--text-color)",
    fontSize:"1rem",
  },


  button:{
    width:"100%",
    padding:"14px 20px",
    borderRadius:"12px",
    border:"none",
    background:"var(--primary)",
    color:"#ffffff",
    fontWeight:700,
    fontSize:"1rem",
    cursor:"pointer",
    boxShadow:"0 8px 20px var(--shadow-color)",
  },


  linkButton:{
    width:"100%",
    padding:"12px",
    borderRadius:"10px",
    border:"1px solid var(--border-color)",
    background:"transparent",
    color:"var(--primary)",
    fontWeight:700,
    cursor:"pointer",
  }

};



const Register = () => {

  const navigate = useNavigate();

  const { user } = useUser();

  const {
    player,
    isRegistered,
    registerPlayer,
    unregisterPlayer,
    playerLoading,
  } = usePlayer();


  const { events } = useEvents();


  const [playerName,setPlayerName] = useState("");
  const [region,setRegion] = useState("na");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");



  const deadline = event?.deadline

    ? new Date(event.deadline).toLocaleString(
        [],
        {
          dateStyle:"long",
          timeStyle:"short",
        }
      )

    : "No Active Deadline";





  async function handleRegister(){

    try{

      setLoading(true);
      setError("");

      await registerPlayer(playerName);


    }catch(err){

      console.error(err);
      setError(err.message);


    }finally{

      setLoading(false);

    }

  }




  async function handleUnregister(){

    const confirm =
      window.confirm(
        "Are you sure you want to unregister from the event?"
      );


    if(!confirm) return;



    try{

      setLoading(true);
      setError("");

      await unregisterPlayer();


    }catch(err){

      console.error(err);
      setError(err.message);


    }finally{

      setLoading(false);

    }

  }




  if(!user || playerLoading){

    return null;

  }





  return (

    <main style={styles.page}>


      <section style={styles.card}>


        <div style={styles.header}>


          <button
            style={styles.backButton}
            onClick={()=>navigate("/")}
          >

            ← Back Home

          </button>



          <h1 style={styles.title}>
            Event Registration
          </h1>


        </div>





        {isRegistered ? (

          <>


            <div
              style={{
                ...styles.status,
                ...styles.registered
              }}
            >

              Registered ✅

            </div>





            <div style={styles.fields}>


              <label style={styles.label}>

                Region

                <input
                  style={styles.input}
                  value={
                    event?.region === "eu"
                      ? "Europe"
                      : "North America"
                  }
                  disabled
                />

              </label>




              <label style={styles.label}>

                Event Name

                <input
                  style={styles.input}
                  value={
                    event?.eventName ||
                    "No Active Event"
                  }
                  disabled
                />

              </label>





              <label style={styles.label}>

                Deadline

                <input
                  style={styles.input}
                  value={deadline}
                  disabled
                />

              </label>





              <label style={styles.label}>

                In-Game Name

                <input
                  style={styles.input}
                  value={
                    player?.playerName ||
                    "No Name"
                  }
                  disabled
                />

              </label>


            </div>





            <button
              style={styles.linkButton}
              onClick={handleUnregister}
              disabled={loading}
            >

              {loading
                ? "Unregistering..."
                : "Unregister from event"}

            </button>



          </>



        ) : (


          <>


            <div
              style={{
                ...styles.status,
                ...styles.unregistered
              }}
            >

              Unregistered ❌

            </div>




            {error && (

              <div
                style={{
                  ...styles.status,
                  ...styles.unregistered
                }}
              >

                {error}

              </div>

            )}






            <div style={styles.fields}>


              <label style={styles.label}>

                Region

                <select
                  style={styles.select}
                  value={region}
                  onChange={(e)=>setRegion(e.target.value)}
                  disabled
                >

                  <option value="na">
                    North America
                  </option>

                  <option value="eu">
                    Europe
                  </option>

                </select>


              </label>





              <label style={styles.label}>

                Event Name

                <input
                  style={styles.input}
                  value={
                    event?.eventName ||
                    "No Active Event"
                  }
                  disabled
                />

              </label>





              <label style={styles.label}>

                Deadline

                <input
                  style={styles.input}
                  value={deadline}
                  disabled
                />

              </label>





              <label style={styles.label}>

                In-Game Identity

                <input
                  style={styles.input}
                  value={playerName}
                  onChange={(e)=>setPlayerName(e.target.value)}
                  placeholder="Enter your exact in-game name"
                  disabled={loading}
                />

              </label>



            </div>






            <button
              style={{
                ...styles.button,
                opacity:
                  loading || !playerName.trim()
                    ? 0.6
                    : 1,
                cursor:
                  loading || !playerName.trim()
                    ? "not-allowed"
                    : "pointer"
              }}
              onClick={handleRegister}
              disabled={
                loading ||
                !playerName.trim()
              }
            >

              {loading
                ? "Registering..."
                : "Register"}

            </button>



          </>


        )}



      </section>


    </main>

  );

};


export default Register;