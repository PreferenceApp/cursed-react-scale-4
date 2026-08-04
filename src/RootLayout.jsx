import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from "./Footer"
import './index.css';
import ScrollToTop from './ScrollToTop';
export const RootLayout = () => {
  return (
    // minHeight ensures the page is at least full screen, but can expand down
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <ScrollToTop />

      {/* flex: 1 tells main to take up all remaining viewport height space */}
      <main className="app-background" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};
