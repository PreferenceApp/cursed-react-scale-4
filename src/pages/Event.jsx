import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tablesDB } from "../appwrite.js"
import { useUser } from "../context/UserContext.jsx";

const Event = () => {
  const { user, event, setEvent} = useUser();
  const navigate = useNavigate();

  // --- Early Return Authorization Check ---
  // Returns null and halts rendering if user object is missing or lacks 'admin' label
  if (!user || !user.labels?.includes("admin") || !event) {
    return null;
  }

  // --- Form & Component State ---
  const [eventName, setEventName] = useState(event.eventName);
  const [seasonNumber, setSeasonNumber] = useState(event.seasonNumber);
  const [eventId, setEventId] = useState(event.eventId);
  const [deadline, setDeadline] = useState(event.deadline);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // --- Lifecycle: Fetch Current Row Data ---
  useEffect(() => {

     if (event.deadline) {
        const dateObj = new Date(event.deadline);

        // 1. Get your computer's local timezone offset in minutes and convert it to milliseconds
        const timezoneOffsetMs = dateObj.getTimezoneOffset() * 60 * 1000;

        // 2. Subtract the offset to adjust the absolute time value locally
        const localTimeMs = dateObj.getTime() - timezoneOffsetMs;
        const localDateObj = new Date(localTimeMs);

        // 3. This string now cleanly reflects your actual local time
        const formattedDate = localDateObj.toISOString().slice(0, 16); 
        
        setDeadline(formattedDate);
     }

  }, []);

  // --- Form Submit Handler ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    const hasConfirmed = window.confirm("Are you sure you want to update the upcoming event?");
    if (!hasConfirmed) return;

    try {
      setSaving(true);
      
      const payload = {
        eventName: eventName,
        seasonNumber: parseInt(seasonNumber, 10) || 0,
        eventId: eventId,
        deadline: new Date(deadline).toISOString()
      };

      await tablesDB.updateRow({
        databaseId: "db",
        tableId: "events",
        rowId: "event",
        data: payload
      }); 

      setEvent(payload);
      setMessage({ text: "Event updated successfully!", isError: false });
    } catch (error) {
      console.error("Appwrite update error:", error);
      setMessage({ text: error.message || "Failed to update.", isError: true });
    } finally {
      setSaving(false);
    }
  };

  // --- Unified Layout Styling Matrix ---
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "6px 8px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      width: "100%",
      minHeight: 0,
    },
    hero: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      gap: "8px",
    },
    card: {
      width: "100%",
      maxWidth: "500px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxSizing: "border-box",
      boxShadow: "0 10px 25px rgba(0,0,0,.15)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      alignItems: "stretch"
    },
    title: {
      fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
      fontWeight: "900",
      color: "var(--primary)",
      margin: "15px 0",
      lineHeight: "1",
      textAlign: "center"
    },
    divider: {
      width: "100%",
      border: "0",
      borderTop: "1px solid #ddd",
      margin: "5px 0",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      textAlign: "left"
    },
    label: {
      fontSize: "0.85rem",
      fontWeight: "bold",
      color: "var(--primary)",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      fontFamily: "inherit", // 👈 Add this line to overwrite the browser's default monospace font
      width: "100%",
      boxSizing: "border-box",
      outline: "none"
    },
    statusMessage: {
      fontSize: "0.9rem",
      fontWeight: "600",
      textAlign: "center",
      padding: "8px",
      borderRadius: "6px",
      backgroundColor: message.isError ? "#ffebee" : "#e8f5e9",
      color: message.isError ? "#c62828" : "#2e7d32"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.card}>
          
          <p style={styles.title}>Manage Upcoming Event</p>
          
          {message.text && (
            <div style={styles.statusMessage}>
              {message.text}
            </div>
          )}

            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              {/* Season Number - Integer */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Season Number:</label>
                <input 
                  type="number" 
                  step="1"
                  min={1}
                  style={styles.input}
                  value={seasonNumber}
                  onChange={(e) => setSeasonNumber(e.target.value)}
                  required
                />
              </div>
                
                {/* Event Name - String */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Name:</label>
                <input 
                  type="text" 
                  style={styles.input}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>

              {/* Event ID - String */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Event ID: Must be unique and URL friendly (i.e. s1-purl-open-1)</label>
                <input 
                  type="text" 
                  style={styles.input}
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  required
                />
              </div>

              {/* Deadline - DateTime */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Deadline:</label>
                <input 
                  type="datetime-local" 
                  style={styles.input}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <hr style={styles.divider} />

              <button 
                type="submit" 
                className="btn" 
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save"}
              </button>

            </form>

          <button className="btn" onClick={() => navigate("/")}>
            Back Home
          </button>

        </div>
      </div>
    </div>
  );
};

export default Event;
