import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService.js';

export const BulletRewriterModal = ({ defaultBullet = '', targetRole = 'Senior Software Engineer' }) => {
  const [bulletText, setBulletText] = useState(defaultBullet || 'Worked on backend APIs and improved application features for the team.');
  const [role, setRole] = useState(targetRole);
  const [skills, setSkills] = useState('Scalability, Redis, Node.js, Latency Reduction');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleRewrite = async () => {
    if (!bulletText.trim()) return;
    setLoading(true);
    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const data = await aiService.rewriteBullet({
        bulletText,
        targetRole: role,
        skillsToHighlight: skillsArray,
      });
      setResult(data);
    } catch (err) {
      alert(err.message || 'Failed to rewrite bullet point.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wand2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Google XYZ Bullet Point Optimizer</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Transform passive tasks into high-impact accomplishments (Accomplished [X], measured by [Y], by doing [Z])
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Target Role
          </label>
          <input
            className="input-field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Skills / Metrics to Highlight
          </label>
          <input
            className="input-field"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Latency, Microservices, Scale"
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          Your Current Resume Bullet Point
        </label>
        <textarea
          className="input-field"
          rows={3}
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
          placeholder="Paste a resume bullet point here..."
          style={{ resize: 'vertical' }}
        />
      </div>

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRewrite}
          disabled={loading || !bulletText.trim()}
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Generating High-Impact Variations...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Optimize Bullet Point with AI
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              AI Optimized Variations
            </h4>

            {/* Option 1: Google XYZ Formula */}
            <div
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">Google XYZ Formula (Recommended)</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleCopy(result.googleXyz, 'xyz')}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.775rem' }}
                >
                  {copiedKey === 'xyz' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  {copiedKey === 'xyz' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{result.googleXyz}</p>
            </div>

            {/* Option 2: Metric Heavy */}
            <div
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-success">Metric & Scale Heavy</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleCopy(result.metricHeavy, 'metric')}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.775rem' }}
                >
                  {copiedKey === 'metric' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  {copiedKey === 'metric' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{result.metricHeavy}</p>
            </div>

            {/* Option 3: Concise */}
            <div
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">Concise & Action-Oriented</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleCopy(result.concise, 'concise')}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.775rem' }}
                >
                  {copiedKey === 'concise' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  {copiedKey === 'concise' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{result.concise}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
