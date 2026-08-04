import { useUser } from "./context/UserContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext.jsx";
import Avatar from "./components/Avatar.jsx";
import { usePlayer } from "./context/PlayerContext.jsx";


const styles = {

  navbar:{
    width:"100%",
    height:"70px",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    padding:"0 30px",
    background:"var(--surface-color)",
    borderBottom:"1px solid var(--border-color)",
    boxShadow:"0 4px 15px var(--shadow-color)",
    position:"sticky",
    top:0,
    zIndex:100,
  },


  logoContainer:{
    display:"flex",
    alignItems:"center",
    textDecoration:"none",
  },


  logo:{
    height:"45px",
    width:"45px",
    objectFit:"contain",
    borderRadius:"12px",
  },


  right:{
    display:"flex",
    alignItems:"center",
    gap:"15px",
  },


  themeButton:{
    width:"42px",
    height:"42px",
    borderRadius:"50%",
    border:"1px solid var(--border-color)",
    background:"var(--bg-color)",
    color:"var(--text-color)",
    cursor:"pointer",
    fontSize:"1.2rem",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
  },


  loginButton:{
    padding:"10px 22px",
    borderRadius:"10px",
    border:"none",
    cursor:"pointer",
    fontSize:"0.95rem",
    fontWeight:700,
    background:"var(--primary)",
    color:"#ffffff",
    boxShadow:"0 6px 15px var(--shadow-color)",
  },


  avatar:{
    cursor:"pointer",
  }

};



export const Navbar = () => {

  const navigate = useNavigate();

  const { user, login } = useUser();
  const { player } = usePlayer();
  const { theme, toggleTheme } = useTheme();


  const handleLogin = async () => {
    await login("success");
  };


  return (

    <nav style={styles.navbar}>


      <Link
        to="/"
        style={styles.logoContainer}
      >

        <img
          src="/mini.png"
          alt="Main Logo"
          style={styles.logo}
        />

      </Link>



      <div style={styles.right}>


        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={styles.themeButton}
        >

          {theme === "dark" ? "☀️" : "🌙"}

        </button>



        {user ? (

          <Avatar
            player={player}
            style={styles.avatar}
            onClick={() => navigate("/profile")}
          />


        ) : (


          <button
            onClick={handleLogin}
            style={styles.loginButton}
          >

            Login

          </button>


        )}


      </div>


    </nav>

  );

};