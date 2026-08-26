import api from './api.js';

export const resumeService = {
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async getResumes(page = 1, limit = 10) {
    const res = await api.get(`/resumes?page=${page}&limit=${limit}`);
    return res;
  },

  async getResumeById(id) {
    const res = await api.get(`/resumes/${id}`);
    return res.data;
  },

  async deleteResume(id) {
    const res = await api.delete(`/resumes/${id}`);
    return res.data;
  },
};
