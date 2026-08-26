import api from './api.js';

export const atsService = {
  async analyzeResume(payload) {
    const res = await api.post('/ats/analyze', payload);
    return res.data;
  },

  async getHistory(page = 1, limit = 10) {
    const res = await api.get(`/ats/history?page=${page}&limit=${limit}`);
    return res;
  },
};
