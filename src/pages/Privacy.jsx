import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
      {/* PRIVACY POLICY SECTION                                                    */}
      {/* ========================================================================= */}
      <section style={sectionStyle}>
        <h1 style={{ color: 'var(--primary)' }}>
          Privacy Policy
        </h1>
        <p style={{ opacity: 0.7, fontStyle: 'italic' }}>Last updated: July 14, 2026</p>
        <p>Your privacy is important to us. This policy explains how we collect, store, and protect your information when you use our platform.</p>

        <div style={subSectionStyle}>
          <h3>1. Information We Collect</h3>
          <p>When you log in to our application, we collect specific data to set up your account profile:</p>
          <ul>
            <li><strong>Discord Profile Data:</strong> We use Discord OAuth to securely read your username, avatar, and Discord ID.</li>
            <li><strong>Email Address:</strong> We collect your email address via the Discord OAuth scope to manage your account.</li>
          </ul>
        </div>

        <div style={subSectionStyle}>
          <h3>2. Data Storage & Infrastructure</h3>
          <p>We prioritize the security of your backend data. All user data is processed and stored securely:</p>
          <div style={highlightBox}>
            <strong>Backend Architecture:</strong> Your user profile, metadata, and authentication credentials are encrypted and securely stored using <strong>Appwrite Cloud Services</strong>.
          </div>
        </div>

        <div style={subSectionStyle}>
          <h3>3. How We Use Your Data</h3>
          <p>Your information is used strictly to provide core platform features, authenticate your identity, and save your application preferences. We do not track you across external websites or sell your data to third parties.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>4. Revoking Access</h3>
          <p>You can revoke our app's access to your Discord account at any time via your <em>Discord User Settings &gt; Authorized Apps</em> panel. To request total deletion of your stored Appwrite data, please contact Cursed on discord</p>
        </div>
      </section>

      <hr style={dividerStyle} />

      {/* ========================================================================= */}
      {/* TERMS OF SERVICE SECTION                                                  */}
      {/* ========================================================================= */}
      <section style={sectionStyle}>
        <h1 style={{ color: 'var(--primary)', }}>
          Terms of Service
        </h1>
        <p style={{ opacity: 0.7, fontStyle: 'italic' }}>Last updated: July 14, 2026</p>
        <p>By logging in via Discord OAuth and using our services, you agree to comply with these terms.</p>

        <div style={subSectionStyle}>
          <h3>1. Account Requirements</h3>
          <p>You must possess a valid, active Discord account to access our services. You are responsible for any activity that originates from your authenticated profile.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>2. Acceptable Use</h3>
          <p>You agree not to abuse our application API, scrape user information from our Appwrite databases, or manipulate data payloads sent through our client applications.</p>
        </div>

        <div style={subSectionStyle}>
          <h3>3. Disclaimers</h3>
          <p>We rely on Discord and Appwrite uptime to provide our web features. We are not liable for temporary service interruptions caused by third-party infrastructure outages.</p>
        </div>
      </section>
      <hr style={dividerStyle} />

       <p style={{ marginTop: '20px' }}>
          <Link to="/" style={linkStyle}>
            Return to Home
          </Link>
        </p>
    </div>
  );
};

export default Privacy;
