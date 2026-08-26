import React from 'react';
import { motion } from 'framer-motion';

export const MetricCard = ({ title, value, icon: Icon, subtitle, badgeText, badgeType = 'primary' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card card-interactive"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</span>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon size={18} />
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{value}</h3>
        {badgeText && <span className={`badge badge-${badgeType}`}>{badgeText}</span>}
      </div>

      {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </motion.div>
  );
};
