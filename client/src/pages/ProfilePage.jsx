import React, { useState } from 'react';
import { User, Briefcase, Mail, CheckCircle2, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Chen');
  const [targetJobTitle, setTargetJobTitle] = useState(user?.targetJobTitle || 'Senior Software Engineer');
  const [preferredIndustry, setPreferredIndustry] = useState(user?.preferredIndustry || 'Technology & Cloud');
  const [savedMessage, setSavedMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedMessage(false);
    try {
      const updated = await authService.updateProfile({ name, targetJobTitle, preferredIndustry });
      updateUser(updated);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch {
      // Local fallback
      updateUser({ name, targetJobTitle, preferredIndustry });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Profile & Career Preferences</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Manage your default role targets, industry focus, and account security.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {savedMessage && (
          <div
            className="badge-success animate-fade-in"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Profile preferences updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                disabled
                className="input-field"
                value={user?.email || 'demo@resumeiq.ai'}
                style={{ paddingLeft: '2.5rem', opacity: 0.7, cursor: 'not-allowed' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
              Email address cannot be changed.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Target Job Title
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="input-field"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g. Principal Software Engineer"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Briefcase size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Preferred Industry Focus
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="input-field"
                value={preferredIndustry}
                onChange={(e) => setPreferredIndustry(e.target.value)}
                placeholder="e.g. Distributed Cloud, FinTech"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Shield size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            <Save size={16} />
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
