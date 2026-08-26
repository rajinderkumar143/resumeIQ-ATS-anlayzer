import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export const Scanner3DVisual = ({ isScanning = false }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '180px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 800,
      }}
    >
      {/* 3D Grid Plane */}
      <div
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          backgroundImage: `
            linear-gradient(to right, var(--border-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          transform: 'rotateX(60deg) translateY(-20%)',
          opacity: 0.35,
        }}
      />

      {/* Holographic Laser Scanner Beam (Active when scanning or idling) */}
      <motion.div
        animate={
          isScanning
            ? { y: [-80, 80, -80] }
            : { y: [-60, 60, -60] }
        }
        transition={{
          repeat: Infinity,
          duration: isScanning ? 1.4 : 3.5,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, var(--primary) 50%, transparent 100%)',
          boxShadow: '0 0 16px var(--primary), 0 0 32px var(--primary)',
          zIndex: 3,
        }}
      />

      {/* Floating Hologram Nodes */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotateY: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--primary-border)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <Cpu size={16} color="var(--primary)" />
          <span>TF-IDF Keyword Node</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0], rotateY: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut', delay: 0.3 }}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--success-border)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--success-text)',
          }}
        >
          <Sparkles size={16} color="var(--success)" />
          <span>Gemini XYZ Model</span>
        </motion.div>
      </div>
    </div>
  );
};
