import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Wand2,
  Mail,
  HelpCircle,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useResume } from '../context/ResumeContext.jsx';
import { FileUploader } from '../components/FileUploader.jsx';
import { ScoreGauge } from '../components/ScoreGauge.jsx';
import { SkillBadge } from '../components/SkillBadge.jsx';
import { Card3D } from '../components/3d/Card3D.jsx';
import { Scanner3DVisual } from '../components/3d/Scanner3DVisual.jsx';

export const AnalyzerPage = () => {
  const {
    activeResume,
    activeAnalysis,
    targetJd,
    setTargetJd,
    runAnalysis,
    analyzing,
    error,
    SAMPLE_JOB_DESCRIPTION,
  } = useResume();

  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [company, setCompany] = useState('Tech Systems Corp');
  const [keywordFilter, setKeywordFilter] = useState('all'); // 'all' | 'matched' | 'missing'
  const [copiedBullet, setCopiedBullet] = useState(null);

  const handleStartAnalysis = async () => {
    try {
      const result = await runAnalysis({ jdText: targetJd, jobTitle, company });
      if (result.scores.overall >= 80) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch {
      // Handled in context
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedBullet(idx);
    setTimeout(() => setCopiedBullet(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-primary">Dual-Engine Intelligence</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800 }}>ATS Resume Scanner & Matcher</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Evaluate your resume against real-world ATS screening filters and generate AI improvements.
        </p>
      </div>

      {/* Ingestion Tier: File Upload + Job Description Input */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Step 1: Resume Ingestion */}
        <Card3D style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Upload Resume</h3>
          </div>

          <FileUploader />
        </Card3D>

        {/* Step 2: Target Job Description */}
        <Card3D style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Target Job Description</h3>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setTargetJd(SAMPLE_JOB_DESCRIPTION)}
              style={{ fontSize: '0.775rem', padding: '0.25rem 0.6rem' }}
            >
              Reset Sample JD
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <input
              className="input-field"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Target Role Title"
            />
            <input
              className="input-field"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company Name"
            />
          </div>

          <textarea
            className="input-field"
            rows={5}
            value={targetJd}
            onChange={(e) => setTargetJd(e.target.value)}
            placeholder="Paste target Job Description text here..."
            style={{ fontSize: '0.85rem', lineHeight: 1.5, resize: 'vertical' }}
          />
        </Card3D>
      </div>

      {/* Holographic 3D Laser Scanning Visual */}
      <Scanner3DVisual isScanning={analyzing} />

      {/* Scan CTA Trigger */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
          onClick={handleStartAnalysis}
          disabled={analyzing || !activeResume}
          style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem', width: '100%', maxWidth: 400 }}
        >
          {analyzing ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Running Dual-Engine ATS Scan...
            </>
          ) : (
            <>
              <Cpu size={18} />
              Run Dual-Engine ATS Analysis
            </>
          )}
        </motion.button>
      </div>

      {error && (
        <div
          className="badge-danger animate-fade-in"
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Results Display */}
      {activeAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Primary Scorecard & Breakdown Banner */}
          <Card3D
            style={{
              padding: '1.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Animated Score Gauge */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ScoreGauge
                score={activeAnalysis.scores.overall}
                size={180}
                label="Overall ATS Match Score"
              />
            </div>

            {/* Right: Sub-Score Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>ATS Weighted Scoring Breakdown</h3>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Hard & Soft Skill Match (40% Weight)</span>
                  <span style={{ color: 'var(--primary)' }}>{activeAnalysis.scores.skills}%</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeAnalysis.scores.skills}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: 'var(--primary)' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Experience & Action Verbs (25% Weight)</span>
                  <span style={{ color: 'var(--accent)' }}>{activeAnalysis.scores.experience}%</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeAnalysis.scores.experience}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    style={{ height: '100%', backgroundColor: 'var(--accent)' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Quantifiable Impact & Metrics (15% Weight)</span>
                  <span style={{ color: 'var(--success)' }}>{activeAnalysis.scores.impact}%</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeAnalysis.scores.impact}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    style={{ height: '100%', backgroundColor: 'var(--success)' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>Formatting & Parser Structure (10% Weight)</span>
                  <span style={{ color: 'var(--warning)' }}>{activeAnalysis.scores.formatting}%</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeAnalysis.scores.formatting}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    style={{ height: '100%', backgroundColor: 'var(--warning)' }}
                  />
                </div>
              </div>
            </div>
          </Card3D>

          {/* Keyword Intelligence: Matched vs Missing */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Keyword Gap Analysis</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Recruiter filter keywords identified in candidate resume vs. target JD.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="touch-scroll-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setKeywordFilter('all')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    backgroundColor: keywordFilter === 'all' ? 'var(--primary-light)' : 'transparent',
                    borderColor: keywordFilter === 'all' ? 'var(--primary-border)' : 'transparent',
                    color: keywordFilter === 'all' ? 'var(--primary)' : 'inherit',
                  }}
                >
                  All ({ (activeAnalysis.matchedKeywords?.length || 0) + (activeAnalysis.missingKeywords?.length || 0) })
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setKeywordFilter('matched')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    backgroundColor: keywordFilter === 'matched' ? 'var(--success-bg)' : 'transparent',
                    borderColor: keywordFilter === 'matched' ? 'var(--success-border)' : 'transparent',
                    color: keywordFilter === 'matched' ? 'var(--success-text)' : 'inherit',
                  }}
                >
                  Matched ({ activeAnalysis.matchedKeywords?.length || 0 })
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setKeywordFilter('missing')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    backgroundColor: keywordFilter === 'missing' ? 'var(--danger-bg)' : 'transparent',
                    borderColor: keywordFilter === 'missing' ? 'var(--danger-border)' : 'transparent',
                    color: keywordFilter === 'missing' ? 'var(--danger-text)' : 'inherit',
                  }}
                >
                  Missing Gaps ({ activeAnalysis.missingKeywords?.length || 0 })
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(keywordFilter === 'all' || keywordFilter === 'matched') &&
                activeAnalysis.matchedKeywords?.map((kw, i) => (
                  <SkillBadge key={`m-${i}`} skill={kw} type="matched" />
                ))}
              {(keywordFilter === 'all' || keywordFilter === 'missing') &&
                activeAnalysis.missingKeywords?.map((kw, i) => (
                  <SkillBadge key={`gap-${i}`} skill={kw} type="missing" />
                ))}
            </div>
          </div>

          {/* AI Executive Audit & Actionable Bullet Suggestions */}
          {activeAnalysis.aiReview && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Gemini AI Executive Audit & Strategy</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Expert analysis from a Principal Recruiter perspective.
                    </p>
                  </div>
                </div>

                <Link to="/ai-studio" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  <Wand2 size={15} color="var(--primary)" /> Open AI Studio Tools
                </Link>
              </div>

              {/* Executive Summary */}
              <div
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--primary)',
                  fontSize: '0.925rem',
                  lineHeight: 1.6,
                }}
              >
                <strong>Recruiter Summary: </strong>
                {activeAnalysis.aiReview.executiveSummary}
              </div>

              {/* Top Strengths & Critical Improvements Grid */}
              <div className="grid-responsive-1-2">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--success-text)' }}>
                    🎯 Top Identified Strengths
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                    {activeAnalysis.aiReview.topStrengths?.map((s, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--danger-text)' }}>
                    ⚠️ Priority Action Items
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                    {activeAnalysis.aiReview.criticalImprovements?.map((imp, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <AlertCircle size={16} color="var(--danger)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Google XYZ Formula Bullet Point Live Audit */}
              {activeAnalysis.aiReview.bulletPointAudit?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} color="var(--primary)" />
                    Live Bullet Point Transformation (Google XYZ Formula)
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeAnalysis.aiReview.bulletPointAudit.map((b, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', color: 'var(--danger-text)' }}>
                          <strong>Original (Weak): </strong> {b.original}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Reason: {b.critique}
                        </div>
                        <div
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--success-text)',
                            fontWeight: 600,
                            backgroundColor: 'var(--success-bg)',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--success-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.6rem',
                          }}
                        >
                          <div><strong>Optimized (Google XYZ): </strong> {b.improved}</div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleCopy(b.improved, idx)}
                              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                            >
                              {copiedBullet === idx ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                              {copiedBullet === idx ? 'Copied' : 'Copy Formula Bullet'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick AI Action Cards Footer */}
          <div className="grid-responsive-1-2-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <Link to="/ai-studio" className="card card-interactive" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wand2 size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Bullet Rewriter</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Polish individual resume lines</p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>

            <Link to="/ai-studio" className="card card-interactive" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Generate Cover Letter</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tailored to {company}</p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>

            <Link to="/ai-studio" className="card card-interactive" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <HelpCircle size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Interview Prep Kit</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>STAR method flashcards</p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};
