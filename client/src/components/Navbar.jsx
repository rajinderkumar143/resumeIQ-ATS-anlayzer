import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  FileSearch,
  Wand2,
  History,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout, loginAsGuestDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/analyzer', label: 'ATS Analyzer', icon: FileSearch },
    { path: 'ai-studio', label: 'AI Studio', icon: Wand2 },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'History', icon: History },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--primary-glow)',
              flexShrink: 0,
            }}
          >
            <Sparkles size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Resume<span style={{ color: 'var(--primary)' }}>IQ</span>
            </span>
            <span
              className="desktop-only"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                border: '1px solid var(--primary-border)',
              }}
            >
              AI Dual-Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const targetPath = link.path.startsWith('/') ? link.path : `/${link.path}`;
            const isActive = location.pathname === targetPath;
            return (
              <Link
                key={link.path}
                to={targetPath}
                className="btn btn-secondary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: isActive ? 'var(--primary-border)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                <Icon size={15} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & User Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={toggleTheme}
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)', width: 36, height: 36 }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Desktop Auth Controls */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.7rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                  }}
                >
                  <User size={15} color="var(--primary)" />
                  <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={logout}
                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
                  title="Log Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={loginAsGuestDemo}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                >
                  ⚡ Demo Access
                </button>
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-only btn btn-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)', width: 36, height: 36 }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mobile-only"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)',
              overflow: 'hidden',
              flexDirection: 'column',
              padding: '1rem',
              gap: '0.75rem',
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const targetPath = link.path.startsWith('/') ? link.path : `/${link.path}`;
              const isActive = location.pathname === targetPath;
              return (
                <Link
                  key={link.path}
                  to={targetPath}
                  onClick={closeMobileMenu}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    padding: '0.65rem 1rem',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                    borderColor: isActive ? 'var(--primary-border)' : 'transparent',
                  }}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />

            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 1rem' }}
                >
                  <User size={18} color="var(--primary)" />
                  <span>Profile Settings ({user?.name?.split(' ')[0]})</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => { logout(); closeMobileMenu(); }}
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 1rem' }}
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { loginAsGuestDemo(); closeMobileMenu(); }}
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  ⚡ 1-Click Instant Demo Login
                </button>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
