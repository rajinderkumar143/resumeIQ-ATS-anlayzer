import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileQuestion size={36} />
      </div>

      <div>
        <span className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>Error 404</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 460, marginTop: '0.5rem', fontSize: '0.95rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Return to Homepage
        </Link>
        <Link to="/analyzer" className="btn btn-secondary">
          Launch ATS Scanner
        </Link>
      </div>
    </div>
  );
};
