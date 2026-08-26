import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const ScoreGauge = ({ score = 0, size = 160, strokeWidth = 14, label = 'ATS Match Score' }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Spring animation for animated count-up
  const springScore = useSpring(0, { stiffness: 60, damping: 15 });
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    springScore.set(normalizedScore);
    const unsubscribe = springScore.on('change', (latest) => {
      setDisplayScore(Math.round(latest));
    });
    return () => unsubscribe();
  }, [normalizedScore, springScore]);

  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  let color = 'var(--danger)';
  let bgClass = 'badge-danger';
  let rating = 'Needs Work';

  if (displayScore >= 80) {
    color = 'var(--success)';
    bgClass = 'badge-success';
    rating = 'Excellent (ATS Ready)';
  } else if (displayScore >= 60) {
    color = 'var(--warning)';
    bgClass = 'badge-warning';
    rating = 'Good (Room to Improve)';
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transition={{ duration: 0.3 }}
          />
        </svg>

        {/* Center Animated Score Readout */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            key={displayScore}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            style={{
              fontSize: size > 140 ? '2.75rem' : '1.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {displayScore}
          </motion.span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
            / 100
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{ marginTop: '0.75rem', textAlign: 'center' }}
      >
        <span className={`badge ${bgClass}`} style={{ transition: 'all 0.3s ease' }}>{rating}</span>
        {label && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontWeight: 500 }}>
            {label}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};
