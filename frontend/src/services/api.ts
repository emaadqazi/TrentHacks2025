import axios from 'axios';

// Use environment variable for API URL, fallback to relative path
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const resumeApi = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('📤 Uploading:', file.name, file.size, 'bytes');
    console.log('📤 URL:', `${API_BASE_URL}/resume/upload`);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Response status:', response.status, response.statusText);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText = '';
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorText = errorData.error || errorData.message || JSON.stringify(errorData);
          } else {
            errorText = await response.text();
          }
        } catch (e) {
          errorText = `Failed to parse error response: ${e}`;
        }
        console.error('❌ Upload failed:', response.status, errorText);
        throw new Error(errorText || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Upload successful:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Make sure backend is running on port 5001');
      }
      throw error;
    }
  },

  critiqueResume: (resumeId: string, jobDescription: string) => {
    return api.post('/resume/critique', { resumeId, jobDescription });
  },

  getBlockAlternatives: (blockId: string, jobDescription: string) => {
    return api.post('/resume/blocks/alternatives', { blockId, jobDescription });
  },

  scrapeJobPosting: (url: string) => {
    return api.post('/jobs/scrape', { url });
  },
};

export default api;
