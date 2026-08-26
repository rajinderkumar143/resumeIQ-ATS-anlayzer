import api from './api.js';

export const aiService = {
  async rewriteBullet(payload) {
    const res = await api.post('/ai/rewrite-bullet', payload);
    return res.data;
  },

  async generateCoverLetter(payload) {
    const res = await api.post('/ai/cover-letter', payload);
    return res.data;
  },

  async generateInterviewPrep(payload) {
    const res = await api.post('/ai/interview-prep', payload);
    return res.data;
  },
};
