export default function Loading() {
  return (
    <div
      style={styles.container}
      aria-live="polite"
      aria-busy="true"
      className="app-background"
    >
      <style>{animations}</style>

      <img
        src="/main.png"
        alt="Loading..."
        style={styles.heroImage}
      />

      <div style={styles.spinner} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100dvh",
    width: "100%",
    padding: "24px",
    boxSizing: "border-box",
    gap: "clamp(16px, 2vw, 28px)",
  },

  image: {
    width: "clamp(180px, 55vw, 380px)",
    maxWidth: "100%",
    height: "auto",
    borderRadius: "16px",
    animation: "shrinkGrow 1s ease-in-out infinite",
    userSelect: "none",
    pointerEvents: "none",
  },

  heroImage: {
        animation: "shrinkGrow 1s ease-in-out infinite",
        width: '100%',             /* Scales up to fill the container on mobile */
        maxWidth: '550px',         /* Caps its size on desktop so it doesn't get huge */
        height: 'auto',            /* Keeps the original aspect ratio (prevents stretching) */
        borderRadius: '12px',      /* Softens the edges to match your cards */
        marginBottom: '10px',      /* Creates clean spacing above the main title */
        objectFit: 'cover',        /* Ensures crisp rendering */
    },

  spinner: {
    width: "clamp(28px, 4vw, 38px)",
    height: "clamp(28px, 4vw, 38px)",
    border: "3px solid var(--primary)",
    borderTopColor: "var(--secondary)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
};

const animations = `
@keyframes shrinkGrow {
  0%,100% {
    transform: scale(0.98);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;