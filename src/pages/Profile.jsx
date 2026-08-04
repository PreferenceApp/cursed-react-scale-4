import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { tablesDB } from "../appwrite.js";

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

  secondary: {
    padding: 14,
    borderRadius: 12,
    border: "1px solid var(--border-color)",
    background: "transparent",
    color: "var(--text-color)",
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

const Profile = () => {
  const navigate = useNavigate();

  const { user, logout } = useUser();
  const { player, refreshPlayer, refreshPlayers } = usePlayer();

  const [formData, setFormData] = useState(player);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!player) return;

    try {
      setSaving(true);

      await tablesDB.updateRow({
        databaseId: "db",
        tableId: "players",
        rowId: player.$id,
        data: {
          playerName: formData.playerName,
          avatar: formData.avatar,
          event: formData.event,
        },
      });

      await refreshPlayer();
      await refreshPlayers();

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!player) return;

    if (
      !window.confirm(
        "Are you sure you want to delete your profile? Game data will remain."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);

      await tablesDB.deleteRow({
        databaseId: "db",
        tableId: "players",
        rowId: player.$id,
      });

      await refreshPlayer();
      await refreshPlayers();

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  }

  if (!user || !player || !formData) {
    return (
      <main style={styles.loading}>
        Loading profile data...
      </main>
    );
  }

  const avatarUrl =
    player.$id && formData.avatar
      ? `https://cdn.discordapp.com/avatars/${player.$id}/${formData.avatar}.png`
      : "/user.png";

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <button
          style={styles.back}
          onClick={() => navigate("/")}
        >
          ← Back Home
        </button>

        <h1 style={styles.title}>
          Edit My Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            style={styles.avatar}
            onError={(e) => {
              e.currentTarget.src = "/user.png";
            }}
          />

          <div style={styles.fields}>
            <label style={styles.label}>
              PURL User ID
              <input
                style={styles.input}
                value={player.userId || ""}
                disabled
              />
            </label>

            <label style={styles.label}>
              Player ID
              <input
                style={styles.input}
                value={player.$id || ""}
                disabled
              />
            </label>

            <label style={styles.label}>
              In-Game Name
              <input
                style={styles.input}
                value={formData.playerName || ""}
                onChange={(e) =>
                  handleChange("playerName", e.target.value)
                }
                required
              />
            </label>

            <label style={styles.label}>
              Current Event ID
              <input
                style={styles.input}
                value={formData.event || ""}
                onChange={(e) =>
                  handleChange("event", e.target.value)
                }
              />
            </label>

            <label style={styles.label}>
              Avatar Hash
              <input
                style={styles.input}
                value={formData.avatar || ""}
                onChange={(e) =>
                  handleChange("avatar", e.target.value)
                }
              />
            </label>
          </div>

          <hr style={styles.divider} />

          <div style={styles.actions}>
            <button
              type="submit"
              style={styles.primary}
              disabled={saving || deleting}
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>

            <button
              type="button"
              style={styles.secondary}
              onClick={handleLogout}
              disabled={saving || deleting}
            >
              Logout
            </button>

            <button
              type="button"
              style={styles.danger}
              onClick={handleDelete}
              disabled={saving || deleting}
            >
              {deleting ? "Deleting..." : "Delete Profile"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Profile;