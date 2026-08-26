import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Sparkles, X } from 'lucide-react';
import { useResume } from '../context/ResumeContext.jsx';

export const FileUploader = () => {
  const { activeResume, uploadResume, loadSampleResume, uploading, clearSession } = useResume();
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    setLocalError(null);
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setLocalError('File size exceeds 5MB. Please upload a smaller document.');
      return;
    }

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setLocalError('Invalid format. Please upload a PDF or DOCX file.');
      return;
    }

    try {
      await uploadResume(file);
    } catch (err) {
      setLocalError(err.message || 'Failed to upload and parse resume.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {!activeResume ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{
              border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: dragOver ? 'var(--primary-light)' : 'var(--bg-card)',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
              position: 'relative',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <motion.div
                animate={uploading ? { rotate: 360 } : dragOver ? { y: -8, scale: 1.1 } : { y: [0, -4, 0] }}
                transition={uploading ? { repeat: Infinity, duration: 1, ease: 'linear' } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadCloud size={28} />
              </motion.div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {uploading ? 'Parsing Resume Stream...' : 'Upload your Resume (PDF or DOCX)'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Drag and drop your file here, or click to browse (Max 5MB)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <span className="badge badge-primary">PDF</span>
                <span className="badge badge-primary">DOCX</span>
                <span className="badge badge-primary">TXT</span>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn btn-secondary"
                  onClick={loadSampleResume}
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
                >
                  <Sparkles size={15} color="var(--primary)" />
                  Load Sample Senior Engineer Resume
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.975rem', fontWeight: 700 }}>{activeResume.fileName}</h4>
                  <span className="badge badge-success">
                    <CheckCircle size={12} /> Parsed ({activeResume.parsedData?.skills?.length || 0} Skills)
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activeResume.parsedData?.contactInfo?.name || 'Candidate'} • {activeResume.parsedData?.contactInfo?.email || 'Email extracted'} • {activeResume.parsedData?.wordCount || 0} words
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                style={{ fontSize: '0.825rem', padding: '0.4rem 0.8rem' }}
              >
                Replace
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearSession}
                style={{ padding: '0.4rem 0.6rem', color: 'var(--danger)' }}
                title="Remove resume"
              >
                <X size={16} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {localError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="badge-danger"
          style={{
            marginTop: '0.75rem',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <AlertTriangle size={16} />
          <span>{localError}</span>
        </motion.div>
      )}
    </div>
  );
};
