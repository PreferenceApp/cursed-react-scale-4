import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const containerStyle = {
    maxWidth: '800px',
    margin: '0px auto',
    padding: '10px',
    lineHeight: '1.6',
  };

  const sectionStyle = {
    marginBottom: '0px',
    color: 'var(--primary)',
  };

  const subSectionStyle = {
    marginBottom: '0px',
    color: 'var(--primary)',
  };

  const highlightBox = {
    backgroundColor: 'rgba(37, 99, 235, 0.08)', // Adapts softly by using alpha opacity of accent
    borderLeft: '4px solid var(--primary)',
    padding: '15px',
    borderRadius: '4px',
    margin: '0px 0',
  };

  const dividerStyle = {
    border: 'none',
    borderTop: '1px solid rgba(128, 128, 128, 0.2)',
    margin: '0px 0',
  };

  
  const linkStyle = {
    color: 'var(--primary)',
    textDecoration: 'underline',
    cursor: 'pointer',

  };


  return (
    <div style={containerStyle}>
            <Link to="/" style={linkStyle}>
                Return to Home
              </Link>
      {/* ========================================================================= */}
      {/* ABOUT SECTION                                                             */}
      {/* ========================================================================= */}
      <section style={sectionStyle}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '5px' }}>
          About
        </h1>
        <p style={{ opacity: 0.7, fontStyle: 'italic', marginBottom: '25px' }}>Last updated: July 14, 2026</p>

        <div style={subSectionStyle}>
          <h3>What Makes PURL Different?</h3>
          <p>Unlike standalone tournaments, every PURL event connects together. Every match matters. Every placement matters. Every player has something to fight for.</p>
          <p>Our competitive ecosystem includes:</p>
          <ul>
            <li><strong>Official Seasonal Power Rankings</strong></li>
            <li><strong>Player Profiles</strong></li>
            <li><strong>Team Rankings</strong></li>
            <li><strong>Character Rankings</strong></li>
            <li><strong>Historical Statistics</strong></li>
            <li><strong>Tournament Records</strong></li>
            <li><strong>Seasonal Championships</strong></li>
            <li><strong>Storylines that develop throughout the season</strong></li>
          </ul>
          <p>Instead of isolated tournaments, PURL creates an ongoing competitive journey where every event helps define the best players in the world.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>Our Philosophy</h3>
          <p>Competitive integrity comes first. That means:</p>
          <ul>
            <li><strong>Transparent rules</strong></li>
            <li><strong>Consistent formats</strong></li>
            <li><strong>Fair officiating</strong></li>
            <li><strong>Accurate statistics</strong></li>
            <li><strong>Zero tolerance for cheating</strong></li>
          </ul>
          <p>But competition doesn’t have to be boring. Esports should tell stories. Broadcasts should be exciting. Players should become recognizable personalities. Rivalries should matter. Victories should feel earned.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>Our Vision</h3>
          <p>We envision a future where someone new to <strong>My Hero Ultra Rumble</strong> can visit one website and instantly discover:</p>
          <div style={highlightBox}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>The best players</li>
              <li>The strongest teams</li>
              <li>Current rankings</li>
              <li>Upcoming tournaments</li>
              <li>Tournament history</li>
              <li>Match statistics</li>
              <li>Broadcasts</li>
              <li>Community news</li>
            </ul>
          </div>
          <p>PURL aims to become the competitive hub that brings everything together under one roof.</p>
        </div>
      </section>

      <hr style={dividerStyle} />

      <p style={{ marginTop: '30px' }}>
        <Link to="/" style={linkStyle}>
          Return to Home
        </Link>
      </p>
    </div>
  );
};

export default About;
