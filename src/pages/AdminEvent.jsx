import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { tablesDB } from "../appwrite.js";

import { useUser } from "../context/UserContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";


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
    maxWidth:"700px",
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
    display:"inline-flex",
    alignItems:"center",
    border:"none",
    background:"transparent",
    color:"var(--primary)",
    fontWeight:700,
    cursor:"pointer",
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
    marginBottom:"25px",
    textAlign:"center",
    fontWeight:700,
  },


  success:{
    background:"var(--success-bg)",
    color:"var(--success-text)",
  },


  error:{
    background:"var(--danger-bg)",
    color:"var(--danger-text)",
  },


  form:{
    display:"flex",
    flexDirection:"column",
    gap:"20px",
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
    outline:"none",
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


  small:{
    fontSize:"0.85rem",
    fontWeight:400,
    color:"var(--muted-color)",
  },


  button:{
    marginTop:"10px",
    padding:"14px 20px",
    borderRadius:"12px",
    border:"none",
    background:"var(--primary)",
    color:"#ffffff",
    fontSize:"1rem",
    fontWeight:700,
    cursor:"pointer",
    boxShadow:"0 8px 20px var(--shadow-color)",
  }

};



const AdminEvent = () => {

  const navigate = useNavigate();

  const { user } = useUser();
  const { events, setEvents } = useEvents();


  const [eventName, setEventName] = useState("");
  const [region, setRegion] = useState("na");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [eventId, setEventId] = useState("");
  const [deadline, setDeadline] = useState("");

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    text:"",
    isError:false
  });



  const isAdmin =
    user?.labels?.includes("admin");



  useEffect(() => {

    if(!event) return;


    setEventName(event.eventName || "");
    setSeasonNumber(event.seasonNumber || "");
    setEventId(event.eventId || "");
    setRegion(event.region || "na");


    if(event.deadline){

      const dateObj =
        new Date(event.deadline);


      const timezoneOffset =
        dateObj.getTimezoneOffset() * 60000;


      const localDate =
        new Date(
          dateObj.getTime() - timezoneOffset
        );


      setDeadline(
        localDate
          .toISOString()
          .slice(0,16)
      );

    }

  },[event]);



  async function handleUpdate(e){

    e.preventDefault();


    const confirm =
      window.confirm(
        "Are you sure you want to update the upcoming event?"
      );


    if(!confirm) return;


    try{

      setSaving(true);

      setMessage({
        text:"",
        isError:false
      });


      const payload = {

        eventName,

        seasonNumber:
          parseInt(seasonNumber,10) || 0,

        eventId:
          `${eventId}`.toLowerCase(),

        region,

        deadline:
          new Date(deadline).toISOString()

      };


      await tablesDB.updateRow({

        databaseId:"db",

        tableId:"events",

        rowId:"event",

        data:payload

      });


      setEvent(payload);


      setMessage({

        text:"Event updated successfully!",

        isError:false

      });


    }catch(error){

      console.error(error);


      setMessage({

        text:
          error.message ||
          "Failed to update event.",

        isError:true

      });


    }finally{

      setSaving(false);

    }

  }



  if(!isAdmin || !event){

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
            Manage Upcoming Event
          </h1>


        </div>




        {message.text && (

          <div
            style={{
              ...styles.status,
              ...(message.isError
                ? styles.error
                : styles.success)
            }}
          >

            {message.text}

          </div>

        )}






        <form
          style={styles.form}
          onSubmit={handleUpdate}
        >


          <label style={styles.label}>

            Region


            <select
              style={styles.select}
              value={region}
              onChange={(e)=>setRegion(e.target.value)}
              required
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

            Season Number


            <input
              style={styles.input}
              type="number"
              min="1"
              value={seasonNumber}
              onChange={(e)=>setSeasonNumber(e.target.value)}
              required
            />


          </label>






          <label style={styles.label}>

            Event Name


            <input
              style={styles.input}
              type="text"
              value={eventName}
              onChange={(e)=>setEventName(e.target.value)}
              required
            />


          </label>






          <label style={styles.label}>

            Event ID


            <small style={styles.small}>
              Unique URL friendly ID (i.e. eu-season-1-purl-open-3)
            </small>


            <input
              style={styles.input}
              type="text"
              value={eventId}
              onChange={(e)=>setEventId(e.target.value)}
              required
            />


          </label>







          <label style={styles.label}>

            Deadline


            <input
              style={styles.input}
              type="datetime-local"
              value={deadline}
              onChange={(e)=>setDeadline(e.target.value)}
              required
            />


          </label>






          <button
            type="submit"
            style={{
              ...styles.button,
              opacity:saving ? 0.6 : 1,
              cursor:saving ? "not-allowed" : "pointer"
            }}
            disabled={saving}
          >

            {saving
              ? "Saving Changes..."
              : "Save Event"}

          </button>



        </form>


      </section>


    </main>

  );

};


export default AdminEvent;