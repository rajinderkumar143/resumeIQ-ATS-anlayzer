import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { ThreeBackground } from './3d/ThreeBackground.jsx';

export const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* Ambient 3D Three.js Particle and Geometry Canvas */}
      <ThreeBackground />

      <Navbar />

      <main style={{ flex: 1, padding: '2rem 0', position: 'relative', zIndex: 1 }}>
        <div className="app-container">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};
