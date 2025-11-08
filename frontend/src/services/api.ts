import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const resumeApi = {
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  critiqueResume: (resumeId: string, jobDescription: string) => {
    return api.post('/resume/critique', {
      resumeId,
      jobDescription,
    });
  },

  getBlockAlternatives: (blockId: string, jobDescription: string) => {
    return api.post('/resume/blocks/alternatives', {
      blockId,
      jobDescription,
    });
  },

  scrapeJobPosting: (url: string) => {
    return api.post('/jobs/scrape', { url });
  },
};

export default api;

