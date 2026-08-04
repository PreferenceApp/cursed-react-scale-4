import { useUser } from "../context/UserContext.jsx";
import { useEvent } from "../context/EventContext.jsx";
import AuthHome from "./AuthHome.jsx";
import { UseCountdown } from "../helpers/UseCountdown.js";


const styles = {

  page:{
    minHeight:"100vh",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    padding:"40px 20px",
    background:"var(--bg-color)",
  },


  hero:{
    width:"100%",
    maxWidth:"900px",
    textAlign:"center",
    padding:"50px 40px",
    borderRadius:"24px",
    background:"var(--surface-color)",
    boxShadow:"0 20px 50px var(--shadow-color)",
    border:"1px solid var(--border-color)",
  },


  image:{
    width:"100%",
    maxWidth:"600px",
    borderRadius:"18px",
    marginBottom:"35px",
    boxShadow:"0 10px 30px var(--shadow-color)",
  },


  title:{
    fontSize:"clamp(2rem, 5vw, 3.5rem)",
    fontWeight:800,
    margin:"0 0 35px",
    color:"var(--text-color)",
    lineHeight:1.1,
  },


  button:{
    display:"inline-flex",
    alignItems:"center",
    justifyContent:"center",
    gap:"12px",
    padding:"15px 28px",
    borderRadius:"12px",
    border:"none",
    cursor:"pointer",
    fontSize:"1rem",
    fontWeight:700,
    background:"var(--primary)",
    color:"#ffffff",
    transition:"0.2s ease",
    boxShadow:"0 8px 20px var(--shadow-color)",
  },


  icon:{
    width:"22px",
    height:"22px",
  },


  countdown:{
    marginTop:"25px",
    fontSize:"1.4rem",
    fontWeight:700,
    color:"var(--muted-color)",
  }

};



const Home = () => {

  const { user, login } = useUser();
  const { event } = useEvent();

  const { timeLeft, hasStarted } = UseCountdown(event);


  async function handleLogin(){
    await login("register-success");
  }


  const eventName =
    event?.eventName ?? "Welcome to Premier Ultra Rumble League!";


  if(!user){

    return (

      <main style={styles.page}>

        <section style={styles.hero}>


          <img
            src="main2.png"
            alt="Project Preview"
            style={styles.image}
          />


          <h1 style={styles.title}>
            {eventName}
          </h1>



          {hasStarted ? (

            <button style={styles.button}>

              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={styles.icon}
              >
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>


              Watch on Twitch

            </button>


          ) : (


            <>

              <button
                onClick={handleLogin}
                style={styles.button}
              >

                <svg
                  aria-hidden="true"
                  viewBox="0 0 127.14 96.36"
                  fill="currentColor"
                  style={styles.icon}
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.72-10.93,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.67-2.1a75.22,75.22,0,0,0,72.7,0c.87.73,1.76,1.43,2.67,2.1a68.86,68.86,0,0,1-10.64,5.12,74.74,74.74,0,0,0,6.72,10.93,105.73,105.73,0,0,0,31.59-18.83C129.5,49.7,123.38,26.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.14-12.67,11.41-12.67S53.86,46,53.79,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.38,40.36,84.69,40.36,96.1,46,96,53,91,65.69,84.69,65.69Z"/>
                </svg>


                Sign up with Discord

              </button>


              <p style={styles.countdown}>
                {timeLeft}
              </p>

            </>

          )}


        </section>

      </main>

    );

  }


  return <AuthHome />;

};


export default Home;