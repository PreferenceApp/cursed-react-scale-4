import React from 'react';
import { Link } from 'react-router-dom';

const NoMatch = () => {
  const containerStyle = {
    maxWidth: '800px',
    margin: '0px auto',
    padding: '10px',
    lineHeight: '1.6',
  };

  const sectionStyle = {
    marginBottom: '0px',
  };

  const highlightBox = {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderLeft: '4px solid var(--primary)',
    padding: '15px',
    borderRadius: '4px',
    margin: '20px 0',
  };

  const linkStyle = {
    color: 'var(--primary)',
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      {/* ========================================================================= */}
      {/* ERROR / NO MATCH SECTION */}
      {/* ========================================================================= */}
      <section style={sectionStyle}>
        <h1 style={{ color: 'var(--primary)' }}>
          404 - Page Not Found
        </h1>
        <div style={highlightBox}>
          <strong>An error occurred</strong>
        </div>
        <p>
          The page you are looking for does not exist, has been removed, or has changed address. Please check the URL or navigate back to safety.
        </p>
        <p style={{ marginTop: '20px' }}>
          <Link to="/" style={linkStyle}>
            Return to Home
          </Link>
        </p>
      </section>
    </div>
  );
};

export default NoMatch;
