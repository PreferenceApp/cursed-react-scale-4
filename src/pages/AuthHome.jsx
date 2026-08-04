import { useNavigate, Link } from "react-router-dom";

import { useUser } from "../context/UserContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useEvent } from "../context/EventContext.jsx";
import Players from "./Players.jsx";
import Teams from "./Teams.jsx";
import Characters from "./Characters.jsx";
import Avatar from "../components/Avatar.jsx";


const styles = {

  page:{
    minHeight:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"40px 20px",
    background:"var(--bg-color)",
  },


  card:{
    width:"100%",
    maxWidth:"600px",
    padding:"40px",
    borderRadius:"24px",
    background:"var(--surface-color)",
    border:"1px solid var(--border-color)",
    boxShadow:"0 20px 50px var(--shadow-color)",
    textAlign:"center",
  },


  avatar:{
    width:"90px",
    height:"90px",
    borderRadius:"50%",
    marginBottom:"20px",
    cursor:"pointer",
  },


  title:{
    margin:"0 0 30px",
    fontSize:"2rem",
    fontWeight:800,
    color:"var(--text-color)",
  },


  eventInfo:{
    marginBottom:"25px",
  },


  eventTitle:{
    margin:"0 0 10px",
    fontSize:"1.8rem",
    fontWeight:800,
    color:"var(--text-color)",
  },


  deadline:{
    margin:0,
    color:"var(--muted-color)",
    fontSize:"1rem",
  },


  divider:{
    border:"none",
    borderTop:"1px solid var(--border-color)",
    margin:"30px 0",
  },


  status:{
    display:"inline-flex",
    alignItems:"center",
    justifyContent:"center",
    padding:"10px 20px",
    borderRadius:"999px",
    fontWeight:700,
    fontSize:"1rem",
    marginTop:"10px",
  },


  registered:{
    background:"var(--success-bg)",
    color:"var(--success-text)",
  },


  unregistered:{
    background:"var(--danger-bg)",
    color:"var(--danger-text)",
  },


  button:{
    width:"100%",
    padding:"14px 20px",
    marginTop:"15px",
    borderRadius:"12px",
    border:"none",
    background:"var(--primary)",
    color:"#ffffff",
    fontSize:"1rem",
    fontWeight:700,
    cursor:"pointer",
    boxShadow:"0 8px 20px var(--shadow-color)",
    transition:"0.2s ease",
  },


  adminTitle:{
    marginBottom:"15px",
    fontSize:"1.5rem",
    fontWeight:800,
    color:"var(--text-color)",
  }

};



const AuthHome = () => {

  const { user, logout } = useUser();
  const { player, isRegistered } = usePlayer();
  const { event } = useEvent();

  const navigate = useNavigate();


  const isAdmin = user?.labels?.includes("admin");



  const handleLogout = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if(!confirmed) return;


    try {

      await logout();

    } catch(error){

      console.error(error);

    }

  };



  return (

    <main style={styles.page}>


      <section style={styles.card}>


        {/* Uncomment if you want profile display back

        <Avatar
          player={player}
          style={styles.avatar}
          onClick={() => navigate("/profile")}
        />

        <h1 style={styles.title}>
          {player?.playerName || user?.name}
        </h1>

        */}



        <div style={styles.eventInfo}>

          <h2 style={styles.eventTitle}>
            {event?.eventName || "No Active Event"}
          </h2>


          <p style={styles.deadline}>

            {event?.deadline

              ? new Date(
                  event.deadline
                ).toLocaleString(
                  [],
                  {
                    dateStyle:"long",
                    timeStyle:"short",
                  }
                )

              : "No Active Deadline"

            }

          </p>

        </div>



        <div
          style={{
            ...styles.status,
            ...(isRegistered
              ? styles.registered
              : styles.unregistered)
          }}
        >

          {isRegistered
            ? "Registered ✅"
            : "Unregistered ❌"}

        </div>



        <hr style={styles.divider}/>



        <button
          style={styles.button}
          onClick={() => navigate("/register")}
        >

          Register For Upcoming Event

        </button>



        <button
          style={styles.button}
          onClick={() => navigate("/registered")}
        >

          View Registered Players

        </button>




        {isAdmin && (

          <>

            <hr style={styles.divider}/>


            <h2 style={styles.adminTitle}>
              Admin
            </h2>



            <button
              style={styles.button}
              onClick={() => navigate("/admin/event")}
            >

              Manage Upcoming Event

            </button>



            <button
              style={styles.button}
              onClick={() => navigate("/admin/players")}
            >

              Manage All Players

            </button>


          </>

        )}



      </section>
 {/* Three Panel Grid System */}
      <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
        
        {/* Top Players Segment */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #edf2f7", paddingBottom: "10px", marginBottom: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>🏆 Top Players</h2>
            <Link to={`/players`} style={{ fontSize: "13px", textDecoration: "none", color: "#0066cc", fontWeight: "500" }}>
              View full player list →
            </Link>
          </div>
          <Players limit={5} dashboardMode={true} />
        </section>

        {/* Top Teams Segment */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #edf2f7", paddingBottom: "10px", marginBottom: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>🛡️ Top Teams</h2>
            <Link to={`/teams`} style={{ fontSize: "13px", textDecoration: "none", color: "#0066cc", fontWeight: "500" }}>
              View full team list →
            </Link>
          </div>
          <Teams limit={5} dashboardMode={true} />
        </section>

        {/* Top Characters Segment */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #edf2f7", paddingBottom: "10px", marginBottom: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>⚡ Top Characters</h2>
            <Link to={`/characters`} style={{ fontSize: "13px", textDecoration: "none", color: "#0066cc", fontWeight: "500" }}>
              View full character list →
            </Link>
          </div>
          <Characters limit={5} dashboardMode={true} />
        </section>

      </div>

    </main>

  );

};


export default AuthHome;