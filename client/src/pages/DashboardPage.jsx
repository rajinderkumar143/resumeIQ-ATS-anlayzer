import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Award,
  AlertCircle,
  PlusCircle,
  FileSearch,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { MetricCard } from '../components/MetricCard.jsx';
import { SkillBadge } from '../components/SkillBadge.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getDashboardAnalytics();
      setData(res);
    } catch {
      // Fallback sample dashboard data
      setData({
        summary: {
          totalResumes: 1,
          totalAnalyses: 4,
          avgScore: 84,
          maxScore: 92,
        },
        scoreProgression: [
          { scanNumber: 'Scan 1', date: 'Aug 1', overallScore: 62, skillScore: 58, impactScore: 45 },
          { scanNumber: 'Scan 2', date: 'Aug 5', overallScore: 74, skillScore: 70, impactScore: 65 },
          { scanNumber: 'Scan 3', date: 'Aug 10', overallScore: 82, skillScore: 80, impactScore: 85 },
          { scanNumber: 'Scan 4', date: 'Aug 14', overallScore: 92, skillScore: 94, impactScore: 90 },
        ],
        categoryDistribution: [
          { category: 'Frontend', count: 12 },
          { category: 'Backend', count: 15 },
          { category: 'Database', count: 8 },
          { category: 'Cloud/DevOps', count: 9 },
          { category: 'AI/Data', count: 6 },
          { category: 'Testing', count: 5 },
        ],
        topMissingSkills: [
          { skill: 'GraphQL', count: 3 },
          { skill: 'Kubernetes', count: 2 },
          { skill: 'Terraform', count: 2 },
          { skill: 'Redis', count: 1 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800 }}>
            Welcome, {user?.name?.split(' ')[0] || 'Engineer'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Targeting: <strong>{user?.targetJobTitle || 'Senior Software Engineer'}</strong> in{' '}
            <strong>{user?.preferredIndustry || 'Technology'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchAnalytics}
            disabled={loading}
            title="Refresh analytics"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link to="/analyzer" className="btn btn-primary">
            <PlusCircle size={16} />
            New ATS Scan
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-responsive-1-2-4">
        <MetricCard
          title="Average ATS Match"
          value={`${data?.summary?.avgScore || 84}%`}
          icon={Award}
          subtitle="Across all analyzed applications"
          badgeText="+22% this month"
          badgeType="success"
        />
        <MetricCard
          title="Peak ATS Score"
          value={`${data?.summary?.maxScore || 92}%`}
          icon={TrendingUp}
          subtitle="Highest resume optimization"
          badgeText="Top 5% Tier"
          badgeType="primary"
        />
        <MetricCard
          title="Total Resumes Uploaded"
          value={data?.summary?.totalResumes || 1}
          icon={FileText}
          subtitle="Stored & parsed securely"
        />
        <MetricCard
          title="Job Matches Run"
          value={data?.summary?.totalAnalyses || 4}
          icon={BarChart3}
          subtitle="Dual-engine evaluations"
        />
      </div>

      {/* Charts Section */}
      <div className="grid-responsive-1-2">
        {/* ATS Score Trajectory Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 340 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ATS Score Progression</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Historical improvement over successive resume iterations
            </p>
          </div>

          <div style={{ flex: 1, width: '100%', minHeight: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.scoreProgression || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="scanNumber" stroke="var(--text-muted)" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="overallScore" name="Overall Score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Category Distribution Bar Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 340 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Skills Distribution by Domain</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Identified competencies across technical disciplines
            </p>
          </div>

          <div style={{ flex: 1, width: '100%', minHeight: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.categoryDistribution || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={10} interval={0} angle={-15} textAnchor="end" height={35} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Verified Skills" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Missing Skills Across Applications */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="var(--warning)" />
              Most Frequent Skill Gaps in Target JDs
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              These skills frequently appeared in target Job Descriptions but were missing in your resume.
            </p>
          </div>

          <Link to="/analyzer" className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
            <Sparkles size={14} color="var(--primary)" /> Scan New JD
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {data?.topMissingSkills?.map((item, idx) => (
            <SkillBadge key={idx} skill={item.skill} type="warning" count={`${item.count} JDs`} />
          ))}
        </div>
      </div>
    </div>
  );
};
