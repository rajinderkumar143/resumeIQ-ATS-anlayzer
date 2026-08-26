import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Tag } from 'lucide-react';

export const SkillBadge = ({ skill, type = 'neutral', count = null }) => {
  let badgeClass = 'badge-primary';
  let Icon = Tag;

  if (type === 'matched') {
    badgeClass = 'badge-success';
    Icon = CheckCircle2;
  } else if (type === 'missing') {
    badgeClass = 'badge-danger';
    Icon = AlertCircle;
  } else if (type === 'warning') {
    badgeClass = 'badge-warning';
    Icon = AlertCircle;
  }

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`badge ${badgeClass}`}
      style={{
        textTransform: 'capitalize',
        padding: '0.35rem 0.75rem',
        gap: '0.4rem',
        cursor: 'default',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Icon size={13} />
      <span>{skill}</span>
      {count !== null && (
        <span style={{ opacity: 0.8, fontSize: '0.7rem', marginLeft: '0.2rem' }}>({count})</span>
      )}
    </motion.span>
  );
};
