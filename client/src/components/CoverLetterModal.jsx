import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService.js';
import { useResume } from '../context/ResumeContext.jsx';

export const CoverLetterModal = () => {
  const { activeResume, targetJd } = useResume();
  const [roleTitle, setRoleTitle] = useState('Senior Full-Stack Engineer');
  const [companyName, setCompanyName] = useState('Acme Technologies');
  const [tone, setTone] = useState('professional');
  const [letterContent, setLetterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!activeResume) {
      alert('Please upload or load a sample resume first.');
      return;
    }
    setLoading(true);
    try {
      const data = await aiService.generateCoverLetter({
        resumeId: activeResume.resumeId,
        resumeText: activeResume.rawText,
        jobDescriptionText: targetJd,
        companyName,
        roleTitle,
        tone,
      });
      setLetterContent(data.content);
    } catch (err) {
      alert(err.message || 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([letterContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${roleTitle.replace(/\s+/g, '_')}_${companyName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          <Mail size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Tailored Cover Letter Generator</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Synthesize a high-converting cover letter matching your resume to the target Job Description.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Target Company
          </label>
          <input
            className="input-field"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google, Stripe"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Target Role Title
          </label>
          <input
            className="input-field"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Tone
          </label>
          <select
            className="input-field"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional">Professional & Technical</option>
            <option value="confident">Confident & Leadership-Focused</option>
            <option value="conversational">Warm & Conversational</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Synthesizing Custom Cover Letter...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Cover Letter with Gemini AI
            </>
          )}
        </button>
      </div>

      {letterContent && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Generated Cover Letter Draft
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopy}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownload}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>

          <textarea
            className="input-field"
            rows={12}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
        </div>
      )}
    </div>
  );
};
