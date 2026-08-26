import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, FileText, Search, PlusCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { atsService } from '../services/atsService.js';
import { ScoreGauge } from '../components/ScoreGauge.jsx';

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await atsService.getHistory(1, 20);
      setHistory(res.data || []);
    } catch {
      // Mock history for preview
      setHistory([
        {
          id: '1',
          fileName: 'Alex_Chen_Senior_Engineer_Resume.pdf',
          jobTitle: 'Senior Full-Stack Engineer',
          company: 'CloudScale Technologies',
          overallScore: 88,
          skillScore: 90,
          impactScore: 85,
          matchedKeywords: ['react', 'node.js', 'postgresql', 'docker', 'aws', 'redis'],
          missingKeywords: ['graphql', 'kubernetes'],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          fileName: 'Alex_Chen_Staff_Backend.pdf',
          jobTitle: 'Staff Backend Architect',
          company: 'Enterprise FinTech',
          overallScore: 78,
          skillScore: 75,
          impactScore: 80,
          matchedKeywords: ['node.js', 'python', 'postgresql', 'microservices'],
          missingKeywords: ['kafka', 'grpc', 'terraform'],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(
    (item) =>
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800 }}>ATS Scan History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Review past resume evaluations, score iterations, and keyword gap audits.
          </p>
        </div>

        <Link to="/analyzer" className="btn btn-primary">
          <PlusCircle size={16} />
          New ATS Scan
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resume name, target role, or company..."
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Scan History Records */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            let scoreBadge = 'badge-success';
            if (item.overallScore < 60) scoreBadge = 'badge-danger';
            else if (item.overallScore < 80) scoreBadge = 'badge-warning';

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 280px' }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.jobTitle}</h3>
                      <span className="badge badge-primary">{item.company}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {item.fileName} • {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', maxWidth: 300 }}>
                  <div>
                    <span className={`badge ${scoreBadge}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.65rem' }}>
                      {Math.round(item.overallScore)}% Match
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {item.matchedKeywords?.length || 0} Matched • {item.missingKeywords?.length || 0} Gaps
                    </p>
                  </div>

                  <Link
                    to="/analyzer"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}
                  >
                    Re-Scan <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <FileText size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Scan Records Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Upload your resume in the ATS Scanner to start building your history.
            </p>
            <Link to="/analyzer" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Launch ATS Scanner
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
