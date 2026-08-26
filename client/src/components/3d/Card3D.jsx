import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const Card3D = ({ children, maxTilt = 8, scale = 1.02, style = {}, className = '', ...props }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setTilt({ x: tiltX, y: tiltY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{
        perspective: 1000,
        width: '100%',
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`card ${className}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        {...props}
      >
        {/* Dynamic Specular Glare Reflection */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 60%)`,
            transition: 'opacity 0.2s ease',
            zIndex: 1,
            borderRadius: 'inherit',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
