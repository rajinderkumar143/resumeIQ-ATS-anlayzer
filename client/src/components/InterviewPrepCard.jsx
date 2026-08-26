import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService.js';
import { useResume } from '../context/ResumeContext.jsx';

export const InterviewPrepCard = () => {
  const { activeResume, targetJd } = useResume();
  const [roleTitle, setRoleTitle] = useState('Senior Software Engineer');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleGenerate = async () => {
    if (!activeResume) {
      alert('Please upload or load a sample resume first.');
      return;
    }
    setLoading(true);
    try {
      const data = await aiService.generateInterviewPrep({
        resumeId: activeResume.resumeId,
        resumeText: activeResume.rawText,
        jobDescriptionText: targetJd,
        roleTitle,
      });
      setQuestions(data.questions);
    } catch (err) {
      alert(err.message || 'Failed to generate interview questions.');
    } finally {
      setLoading(false);
    }
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
          <HelpCircle size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Interview Prep & STAR Method Coach</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Predict target role interview questions and master STAR-method responses based on your skill gaps.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Target Interview Role
          </label>
          <input
            className="input-field"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="e.g. Staff Full-Stack Engineer"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{ height: '42px' }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Interview Questions
            </>
          )}
        </button>
      </div>

      {questions && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <h4 style={{ fontSize: '0.925rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={16} color="var(--primary)" />
            Tailored Questions & Sample STAR Responses
          </h4>

          {questions.map((q, idx) => {
            const isExpanded = expandedIndex === idx;
            let categoryBadge = 'badge-primary';
            if (q.category === 'Architecture') categoryBadge = 'badge-warning';
            if (q.category === 'Behavioral') categoryBadge = 'badge-success';

            return (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${categoryBadge}`}>{q.category}</span>
                    <span style={{ fontSize: '0.925rem', fontWeight: 600 }}>{q.question}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>

                {isExpanded && (
                  <div
                    className="animate-fade-in"
                    style={{
                      padding: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {q.whyInterviewerAsks && (
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                          Why Interviewer Asks:
                        </span>
                        <p style={{ marginTop: '0.2rem', color: 'var(--text-secondary)' }}>{q.whyInterviewerAsks}</p>
                      </div>
                    )}

                    {q.starTip && (
                      <div
                        style={{
                          backgroundColor: 'var(--primary-light)',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '3px solid var(--primary)',
                        }}
                      >
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                          STAR Response Strategy:
                        </span>
                        <p style={{ marginTop: '0.2rem' }}>{q.starTip}</p>
                      </div>
                    )}

                    {q.sampleAnswer && (
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--success-text)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                          High-Scoring Sample Answer:
                        </span>
                        <p style={{ marginTop: '0.2rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                          "{q.sampleAnswer}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
