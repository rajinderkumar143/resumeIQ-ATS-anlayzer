import React from 'react';

export const LoadingSkeleton = ({ lines = 3, height = '20px', width = '100%', style = {} }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height,
            width: i === lines - 1 && lines > 1 ? '70%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '50%', height: 16, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '30%', height: 12 }} />
        </div>
      </div>
      <LoadingSkeleton lines={3} height="14px" />
    </div>
  );
};
