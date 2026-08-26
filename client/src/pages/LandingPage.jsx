import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  FileSearch,
  Wand2,
  Award,
  ChevronDown,
  ChevronUp,
  Lock,
  Layers,
  HelpCircle,
  Star
} from 'lucide-react';
import { useResume } from '../context/ResumeContext.jsx';
import { ScoreGauge } from '../components/ScoreGauge.jsx';
import { ThreeHeroScene } from '../components/3d/ThreeHeroScene.jsx';
import { Card3D } from '../components/3d/Card3D.jsx';

export const LandingPage = () => {
  const { loadSampleResume } = useResume();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const handleTryDemo = () => {
    loadSampleResume();
    navigate('/analyzer');
  };

  const faqs = [
    {
      q: 'How does ResumeIQ AI score resumes without hallucinations?',
      a: 'We use a dual-engine architecture. The numerical ATS score (0-100%) is calculated mathematically via deterministic TF-IDF keyword matching, regex metrics, and structural weights. Generative AI (Gemini) is strictly used for semantic recommendations and Google XYZ bullet rewrites.',
    },
    {
      q: 'What is the Google XYZ formula for resume bullets?',
      a: 'Google recruiters recommend structuring every accomplishment bullet as: "Accomplished [X], as measured by [Y], by doing [Z]". ResumeIQ AI identifies passive lines in your resume and automatically converts them into this high-impact structure.',
    },
    {
      q: 'Is my resume data kept private and secure?',
      a: 'Yes. Resumes are parsed directly in memory buffers and never written to unencrypted public disks. All data in transit is protected via TLS 1.3 encryption.',
    },
    {
      q: 'What file formats are supported?',
      a: 'We support PDF (.pdf), Microsoft Word (.docx, .doc), and plain text (.txt) documents up to 5MB.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      {/* Hero Section with Interactive 3D Hologram Core */}
      <section style={{ textAlign: 'center', maxWidth: 960, margin: '1.5rem auto 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="badge badge-primary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.5rem' }}
        >
          <Sparkles size={16} />
          <span>Next-Gen ATS Resume Intelligence & AI Career Suite</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
          }}
        >
          Stop Getting Filtered by ATS. <br />
          <span style={{ color: 'var(--primary)' }}>Pass the Screen. Land the Interview.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: 740,
          }}
        >
          ResumeIQ AI pairs <strong>Deterministic Heuristic NLP</strong> with <strong>Google Gemini AI</strong> to calculate exact ATS keyword match scores, detect missing skills, and rewrite your bullet points into high-impact Google XYZ achievements.
        </motion.p>

        {/* 3D Interactive Core in Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <ThreeHeroScene />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/analyzer" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              <FileSearch size={18} />
              Analyze My Resume Free
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTryDemo}
              style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}
            >
              <Zap size={18} color="var(--primary)" />
              Explore Interactive Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Pill Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--success)" /> 100% Deterministic Keyword Matching
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--success)" /> Google XYZ Bullet Formula
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--success)" /> PII-Safe In-Memory Parsing (Under 5MB)
          </span>
        </motion.div>
      </section>

      {/* Interactive Live Demo Preview Card */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card3D
          style={{
            padding: '2.5rem',
            background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Live Interactive Preview</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>How the Dual-Engine Works</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Deterministic rule-based analysis calculates your mathematical match, while Gemini AI generates context-aware improvements.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            {/* Gauge & Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <ScoreGauge score={88} size={170} label="Senior Full-Stack Engineer Match" />
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'center' }}>
                <div className="badge badge-success" style={{ padding: '0.4rem 0.8rem' }}>18 Skills Matched</div>
                <div className="badge badge-danger" style={{ padding: '0.4rem 0.8rem' }}>2 Skills Missing</div>
              </div>
            </div>

            {/* Real-time Rewriting Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--danger-text)', textTransform: 'uppercase' }}>
                  ❌ Weak / Passive Task (ATS Score: 45%)
                </span>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--danger-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--danger-border)',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                  }}
                >
                  "Worked on building backend REST APIs and fixed database performance bugs for the team."
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--success-text)', textTransform: 'uppercase' }}>
                  ✅ AI Google XYZ Formula (ATS Score: 96%)
                </span>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--success-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--success-border)',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                    fontWeight: 500,
                    color: 'var(--success-text)',
                  }}
                >
                  "Architected and deployed 14+ REST microservices using Node.js and PostgreSQL, reducing P99 latency by 35% and supporting 1.2M+ active users."
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  onClick={handleTryDemo}
                  style={{ width: '100%' }}
                >
                  <Wand2 size={16} />
                  Try Scoring Your Own Resume
                </motion.button>
              </div>
            </div>
          </div>
        </Card3D>
      </motion.section>

      {/* 3-Step Process with 3D Tilt Cards */}
      <section style={{ textAlign: 'center' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Frictionless Workflow</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>How to Land Interviews in 3 Steps</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              step: '1',
              title: 'Upload & Parse',
              desc: 'Upload your PDF or Word resume. Our in-memory parser extracts contact data, skills, experience, and quantifiable metrics in under 1 second.',
            },
            {
              step: '2',
              title: 'Dual-Engine Scan',
              desc: 'Compare against any Job Description to uncover missing hard skills, TF-IDF cosine similarity, and section-by-section health scores.',
            },
            {
              step: '3',
              title: 'Optimize with AI',
              desc: 'Transform passive lines into Google XYZ bullets, generate custom cover letters, and master STAR interview questions.',
            },
          ].map((card) => (
            <Card3D
              key={card.step}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', height: '100%' }}
            >
              <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
                {card.step}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{card.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </Card3D>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Got Questions?</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        padding: '0 1.25rem 1.25rem 1.25rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Ready to Supercharge Your Resume?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 620, fontSize: '1.05rem', lineHeight: 1.6 }}>
          Join thousands of software engineers optimizing their resumes for Google, Meta, Amazon, and top tech companies.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/analyzer" className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};
