import api from './api.js';

export const analyticsService = {
  async getDashboardAnalytics() {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },
};
