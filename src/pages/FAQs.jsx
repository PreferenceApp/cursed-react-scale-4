import React from 'react';
import { Link } from 'react-router-dom';

const FAQs = () => {
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
    marginBottom: '30px', // Adjusted slightly to separate distinct question blocks nicely
    color: 'var(--primary)',
  };

  const highlightBox = {
    backgroundColor: 'rgba(37, 99, 235, 0.08)', // Adapts softly by using alpha opacity of accent
    borderLeft: '4px solid var(--primary)',
    padding: '15px',
    borderRadius: '4px',
    margin: '15px 0',
  };

  const dividerStyle = {
    border: 'none',
    borderTop: '1px solid rgba(128, 128, 128, 0.2)',
    margin: '20px 0',
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
      {/* FAQ SECTION                                                               */}
      {/* ========================================================================= */}
      <section style={sectionStyle}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '5px' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ opacity: 0.7, fontStyle: 'italic', marginBottom: '25px' }}>Last updated: July 28, 2026</p>

        <div style={subSectionStyle}>
          <h3>What is PURL?</h3>
          <p>Premier Ultra Rumble League is a competitive tournament ecosystem for My Hero Ultra Rumble featuring official tournaments, rankings, player statistics, broadcasts, and seasonal championships.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>Is PURL affiliated with Bandai Namco or Byking?</h3>
          <p>No.</p>
          <p>PURL is an independent community-run competitive league created by passionate members of the My Hero Ultra Rumble community.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>What is a PURL Season?</h3>
          <p>A season is a collection of Open Tournaments, Cups, and a Grand Finals that all contribute toward seasonal rankings and championships.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>How do Power Rankings work?</h3>
          <p>Power Rankings are calculated using performance across official PURL events and approved PURL-sanctioned tournaments. Stronger events are weighted more heavily, rewarding consistent high-level play over time.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>Why do player profiles exist?</h3>
          <p>Player profiles allow competitors to build a competitive identity through:</p>
          <ul>
            <li><strong>Tournament history</strong></li>
            <li><strong>Statistics</strong></li>
            <li><strong>Team history</strong></li>
            <li><strong>Character mains</strong></li>
            <li><strong>Rankings</strong></li>
            <li><strong>Achievements</strong></li>
          </ul>
          <p>Instead of disappearing after one event, your accomplishments become part of your competitive legacy.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>Can anyone compete?</h3>
          <p>Yes.</p>
          <p>PURL Opens are open registration events.</p>
          <p>Earn strong finishes to qualify for larger tournaments throughout the season. PURL-sanctioned events are also mostly open registration events.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>What are PURL-sanctioned events?</h3>
          <p>Some community tournaments and scrims may become officially recognized by PURL.</p>
          <p>Results from sanctioned events may contribute to rankings while following the same PURL-standardized competitive rules.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>How are cheaters handled?</h3>
          <p>PURL maintains a competitive integrity policy.</p>
          <p>Verified cheating may result in:</p>
          <div style={highlightBox}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Match forfeits</li>
              <li>Tournament disqualification</li>
              <li>Suspension</li>
              <li>Placement on the Global Ban List</li>
            </ul>
          </div>
          <p>Competitive fairness is one of PURL’s highest priorities.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>How can I become a caster, staff member, or tournament organizer?</h3>
          <p>PURL is always looking for passionate community members.</p>
          <p>Applications for commentators, observers, moderators, production staff, developers, and tournament administrators will periodically open throughout the year.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>Will statistics stay forever?</h3>
          <p>Yes.</p>
          <p>Whenever possible, player history, tournament results, rankings, and achievements are preserved to create a permanent competitive record.</p>
        </div>

        <div style={subSectionStyle}>
          <p style={{ fontStyle: 'italic', marginTop: '40px', opacity: 0.9 }}>
            PURL isn’t just another tournament. It’s the competitive history of My Hero Ultra Rumble being written one match at a time. Whether you’re fighting for your first Top 3 finish or defending a championship, every event contributes to a story bigger than any single tournament—because every player has a story.
          </p>
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

export default FAQs;
