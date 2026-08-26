import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Mail, HelpCircle, Sparkles } from 'lucide-react';
import { BulletRewriterModal } from '../components/BulletRewriterModal.jsx';
import { CoverLetterModal } from '../components/CoverLetterModal.jsx';
import { InterviewPrepCard } from '../components/InterviewPrepCard.jsx';
import { useResume } from '../context/ResumeContext.jsx';

export const AiStudioPage = () => {
  const [activeTab, setActiveTab] = useState('bullet');
  const { activeResume } = useResume();

  const tabs = [
    { id: 'bullet', label: 'Google XYZ Bullet Rewriter', icon: Wand2 },
    { id: 'cover-letter', label: 'AI Cover Letter Generator', icon: Mail },
    { id: 'interview', label: 'STAR Interview Prep Kit', icon: HelpCircle },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-primary">Gemini Intelligence Suite</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800 }}>AI Career & Optimization Studio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Enhance resume impact, draft custom cover letters, and master behavioral & technical interview questions.
        </p>
      </motion.div>

      {/* Tab Navigation (Touch Scrollable on Phone) */}
      <div
        className="touch-scroll-row"
        style={{
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-secondary"
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                borderColor: isActive ? 'var(--primary-border)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                padding: '0.55rem 1.1rem',
                fontSize: '0.85rem',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  style={{
                    position: 'absolute',
                    bottom: -9,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: 'var(--primary)',
                    borderRadius: '2px',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'bullet' && <BulletRewriterModal />}
          {activeTab === 'cover-letter' && <CoverLetterModal />}
          {activeTab === 'interview' && <InterviewPrepCard />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
