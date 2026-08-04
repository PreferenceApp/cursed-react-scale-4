import React from 'react';
import { Link } from 'react-router-dom';

const Rules = () => {
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
    marginBottom: '30px',
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

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    marginBottom: '15px',
  };

  const thStyle = {
    borderBottom: '2px solid rgba(128, 128, 128, 0.4)',
    textAlign: 'left',
    padding: '8px',
    color: 'var(--primary)',
  };

  const tdStyle = {
    borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
    padding: '8px',
    opacity: 0.9,
  };

  return (
    <div style={containerStyle}>
            <Link to="/" style={linkStyle}>
                Return to Home
              </Link>
      {/* ========================================================================= */}
      {/* RULES SECTION                                                             */}
      {/* ========================================================================= */}
      <section style={sectionStyle}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '5px' }}>
          PURL Standardized Rulebook 1.2
        </h1>
        <p style={{ opacity: 0.7, fontStyle: 'italic', marginBottom: '25px' }}>Last updated: July 14, 2026</p>

        {/* RULE 1 */}
        <div style={subSectionStyle}>
          <h2>Rule 1. Season Structure</h2>
          <h3>1.1 Competitive Format</h3>
          <p>Each PURL season spans approximately twenty-four (24) weeks and follows the structure:</p>
          <ul>
            <li><strong>Eight (8) Regional Opens</strong></li>
            <li><strong>Four (4) Regional Cups</strong></li>
            <li><strong>One (1) Grand Finals</strong></li>
          </ul>

          <h3>1.2 Open Tournaments</h3>
          <ul>
            <li>Eight (8) North American Bi-Weekly Opens</li>
            <li>Eight (8) European Bi-Weekly Opens</li>
            <li>Saturday EU Open; Sunday NA Open</li>
            <li>Eight (8) Team spots in each lobby. No second pool.</li>
            <li>No invited teams. All teams must qualify through competition.</li>
          </ul>

          <h3>1.3 Qualification</h3>
          <p>The 1st and 2nd place teams from each Open qualify for the corresponding Regional Cup.</p>

          <h3>1.4 Regional Cups</h3>
          <p>Each season contains two (2) NA Cups and two (2) EU Cups. Each Cup is an 8-team, two-day event featuring four (4) games on Saturday and four (4) games on Sunday, consisting of 8 games total. The top two (2) teams qualify for Grand Finals.</p>

          <h3>1.5 Grand Finals</h3>
          <p>Grand Finals consists of eight (8) teams (4 NA teams and 4 EU teams) competing across a two-day event. It is played over ten (10) total games:</p>
          <ul>
            <li>Five (5) games on NA servers</li>
            <li>Five (5) games on EU servers</li>
          </ul>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 2 */}
        <div style={subSectionStyle}>
          <h2>Rule 2. Standard Match Format</h2>
          <h3>2.1 Open Events</h3>
          <p>Every Standard PURL event consists of five (5) games.</p>

          <h3>2.2 Map Rotation</h3>
          <ul>
            <li><strong>Game 1</strong> — U.A.</li>
            <li><strong>Game 2</strong> — Chaos City</li>
            <li><strong>Game 3</strong> — Neo</li>
            <li><strong>Game 4</strong> — Neo or Chaos City</li>
            <li><strong>Game 5</strong> — U.A.</li>
          </ul>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 3 */}
        <div style={subSectionStyle}>
          <h2>Rule 3. Scoring</h2>
          <h3>3.1 Placement Points</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Placement</th>
                <th style={thStyle}>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={tdStyle}>1st</td><td style={tdStyle}>15</td></tr>
              <tr><td style={tdStyle}>2nd</td><td style={tdStyle}>10</td></tr>
              <tr><td style={tdStyle}>3rd</td><td style={tdStyle}>8</td></tr>
              <tr><td style={tdStyle}>4th</td><td style={tdStyle}>6</td></tr>
              <tr><td style={tdStyle}>5th</td><td style={tdStyle}>3</td></tr>
              <tr><td style={tdStyle}>6th</td><td style={tdStyle}>2</td></tr>
              <tr><td style={tdStyle}>7th</td><td style={tdStyle}>1</td></tr>
              <tr><td style={tdStyle}>8th+</td><td style={tdStyle}>0</td></tr>
            </tbody>
          </table>

          <h3>3.2 Knockout Points</h3>
          <p>Each KO awards <strong>1 Point</strong>.</p>

          <h3>3.3 Damage Points</h3>
          <div style={highlightBox}>
            <p style={{ margin: 0 }}>Every 2,000 team damage = <strong>1 Point</strong>.</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', opacity: 0.8 }}>There is no cap on damage points.</p>
          </div>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 4 */}
        <div style={subSectionStyle}>
          <h2>Rule 4. Leaderboards</h2>
          <h3>4.1 Official Statistics</h3>
          <p>PURL records statistics from Opens, Cups, Grand Finals, and Approved PURL Sponsored Events.</p>

          <h3>4.2 Seasonal Leaderboards</h3>
          <p>Each season contains: Team Leaderboard, Player Leaderboard, Character Leaderboard, and Power Rankings.</p>

          <h3>4.3 All-Time Statistics</h3>
          <p>Season leaderboards reset after each season. All-Time Leaderboards never reset.</p>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 5 */}
        <div style={subSectionStyle}>
          <h2>Rule 5. Sponsored Tournaments</h2>
          <h3>5.1 Eligibility</h3>
          <p>Tournament Organizers wishing to receive PURL Sponsorship must use the complete standardized ruleset.</p>

          <h3>5.2 Competitive Integrity</h3>
          <p>Sponsored tournaments must use standard PURL scoring, up-to-date PURL bans, required PC validation, and approved rules.</p>

          <h3>5.3 Benefits</h3>
          <p>Sponsored tournaments receive official leaderboard integration, Power Rank contribution, website promotion, featured clips, and broadcast support when available.</p>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 6 */}
        <div style={subSectionStyle}>
          <h2>Rule 6. Character & Tuning Restrictions</h2>
          <h3>6.1 Banned Content</h3>
          <p>Characters, Tunings and combinations listed on the official ban list may not be used. Please refer to the <Link to="/bans" style={linkStyle}>Bans page</Link>.</p>
          <p>Banned Characters and tunings are ever evolving with each balance patch. The Standardized Bans will continue to update throughout Opens, Cups and Grand Finals - with some characters falling off of the ban list and others being placed on. Pay special attention as some characters may only be banned IF they are running a specific tuning and will be playable by using different tuning options.</p>

          <h3>6.2 Updates</h3>
          <p>The ban list may change following balance patches.</p>

          <h3>6.3 Penalties</h3>
          <div style={highlightBox}>
            <p style={{ margin: 0 }}>Using a banned character or tuning results in:</p>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
              <li><strong>Zero (0) Placement Points</strong></li>
              <li><strong>Full game point deduction for the offending player</strong></li>
            </ul>
          </div>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 7 */}
        <div style={subSectionStyle}>
          <h2>Rule 7. Disconnects</h2>
          <h3>7.1 Single-Team Disconnects</h3>
          <p>If one or two players disconnect from a single team, the match will continue.</p>

          <h3>7.2 Multi-Team Disconnects</h3>
          <p>If multiple teams experience disconnects caused by a server issue, tournament staff may restart the lobby.</p>

          <h3>7.3 Abuse Prevention</h3>
          <p>Disconnects affecting only one team will not result in a restart.</p>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 8 */}
        <div style={subSectionStyle}>
          <h2>Rule 8. Substitute Players</h2>
          <h3>8.1 Qualified Players</h3>
          <p>Players already qualified for a Cup may not substitute for another team attempting qualification.</p>

          <h3>8.2 Registration</h3>
          <p>Teams should list all intended substitute players during registration.</p>

          <h3>8.3 Emergency Substitutions</h3>
          <p>Tournament Administration may approve emergency substitutions on a case-by-case basis when extraordinary circumstances arise before an event begins.</p>
        </div>


        <hr style={dividerStyle} />
 {/* RULE 9 */}
        <div style={subSectionStyle}>
          <h2>Rule 9. PC Validation</h2>
          <h3>9.1 Required Checks</h3>
          <p>All PC players are subject to PC validation.</p>

          <h3>9.2 Player Conduct</h3>
          <p>Players must cooperate respectfully during PC checks.</p>

          <h3>9.3 Required Files</h3>
          <p>Players may not have:</p>
          <ul>
            <li><strong>Mods directory</strong></li>
            <li><strong>FileOpenLog launch parameter</strong></li>
            <li>Unauthorized MHUR modifications</li>
            <li>Unauthorized MHUR exe files</li>
          </ul>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 10 */}
        <div style={subSectionStyle}>
          <h2>Rule 10. Cheating Investigations</h2>
          <h3>10.1 Investigation Procedure</h3>
          <p>Players under investigation must:</p>
          <ol>
            <li>Remain in the lobby.</li>
            <li>Keep the game open.</li>
            <li>Cooperate with Tournament Staff.</li>
          </ol>

          <h3>10.2 Validation</h3>
          <p>Tournament Staff may inspect:</p>
          <ul>
            <li>Steam play session time</li>
            <li>Mods folder</li>
            <li>Executable files</li>
            <li>FModel validation</li>
          </ul>

          <h3>10.3 Determination</h3>
          <p>Failure to comply does not automatically prove cheating but may be considered during an investigation.</p>

          <h3>10.4 Refusal to Cooperate</h3>
          <p>Refusing a required PC check or intentionally obstructing an investigation may result in disqualification pending review by Tournament Administration.</p>

          <h3>10.5 Global Competitive Sanctions</h3>
          <div style={highlightBox}>
            <p style={{ margin: 0 }}><strong>Prohibited Methods:</strong> Any player found to have used unauthorized software, exploits, account manipulation, collusion, or other prohibited methods to gain a competitive advantage may be suspended or permanently prohibited from participating in all PURL-operated and PURL-sponsored competitions.</p>
            <p style={{ margin: '8px 0 0 0' }}>Sanctions apply to the individual regardless of team, account, username, platform, or region. Players will receive notice of the allegation, the evidence category relied upon, the sanction imposed, and instructions for submitting an appeal. Attempts to evade a sanction may result in an increased or permanent ban.</p>
          </div>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 11 */}
        <div style={subSectionStyle}>
          <h2>Rule 11. Streaming Standards</h2>
          <h3>11.1 Spawn Protection</h3>
          <p>Tournament broadcasts must hide the game during player loading and spawning.</p>

          <h3>11.2 Minimap Protection</h3>
          <p>Tournament broadcasts must cover the minimap whenever live player locations could provide a competitive advantage.</p>

          <h3>11.3 Kota</h3>
          <p>Kota is considered a competitive advantage and does require censorship. For this reason, mini-maps must also be censored or turned off.</p>

          <h3>11.4 Sponsored Broadcasts</h3>
          <p>Sponsored tournaments receive access to the official PURL partner broadcast package.</p>

          <h3>11.5 Commentary</h3>
          <p>Official PURL commentators may be assigned to sponsored events when available if requested.</p>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 12 */}
        <div style={subSectionStyle}>
          <h2>Rule 12. Player Identity</h2>
          <h3>12.1 Registered Identity</h3>
          <p>Players must compete using their registered in-game name for the duration of the current season.</p>

          <h3>12.2 Name Changes</h3>
          <p>IGN changes require Tournament Administration approval.</p>

          <h3>12.3 Impersonation</h3>
          <p>Players may not intentionally impersonate another competitor or alter their identity in a manner that interferes with tournament operations.</p>

          <h3>12.4 Season Identity Lock</h3>
          <p>A player’s registered IGN becomes locked upon competing in their first PURL event of the season.</p>
        </div>

        <hr style={dividerStyle} />

        {/* RULE 13 */}
        <div style={subSectionStyle}>
          <h2>Rule 13. Sportsmanship</h2>
          <h3>13.1 Conduct</h3>
          <p>Players must treat tournament staff, opponents, commentators, and viewers respectfully before, during, and after competition.</p>

          <h3>13.2 Harassment</h3>
          <p>Harassment, hate speech, threats, or targeted abuse directed toward participants or staff may result in penalties up to and including disqualification or suspension from future PURL events.</p>

          <h3>13.3 Competitive Banter & Rivalries</h3>
          <p>PURL encourages healthy competition, rivalries, celebrations, and lighthearted trash talk as part of the competitive experience. Every player has a story and these interactions are part of those stories! Players may celebrate victories, build storylines, joke with one another, and engage in respectful competitive banter, provided it does not become targeted harassment or create a hostile environment.</p>
          
          <p style={{ marginTop: '15px', marginBottom: '5px' }}><strong>Harassment includes, but is not limited to:</strong></p>
          <ul>
            <li>Repeated personal attacks directed at an individual.</li>
            <li>Hate speech or discriminatory language.</li>
            <li>Credible threats of violence or harm.</li>
            <li>Targeted bullying or attempts to encourage others to harass a player.</li>
            <li>Repeated unwanted contact after being asked to stop.</li>
            <li>Doxxing, sharing private information, or encouraging others to do so.</li>
          </ul>

          <p style={{ marginTop: '15px', marginBottom: '5px' }}><strong>The following, by themselves, are generally NOT considered harassment:</strong></p>
          <ul>
            <li>Competitive rivalries (e.g., banter over who is the best at a character).</li>
            <li>Lighthearted trash talk or banter.</li>
            <li>In-game celebrations (including teabagging, attacking a k.o.d player, or emotes).</li>
            <li>Criticism of gameplay or competitive decisions.</li>
            <li>Friendly joking.</li>
          </ul>

          <p style={{ marginTop: '15px', fontStyle: 'italic', opacity: 0.8 }}>Tournament Administration will evaluate reports based on the context, frequency, severity, and intent of the behavior rather than isolated incidents.</p>
        </div>
      </section>

      <p style={{ marginTop: '30px' }}>
        <Link to="/" style={linkStyle}>
          Return to Home
        </Link>
      </p>
    </div>)
};

export default Rules;
