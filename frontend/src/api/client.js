import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response tracking for system availability metrics
let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;

api.interceptors.response.use(
  (response) => {
    totalRequests += 1;
    successfulRequests += 1;
    console.log(`%c[MindfulAI] Request Stats | Total: ${totalRequests} | Success: ${successfulRequests} | Failed: ${failedRequests} | Rate: ${((successfulRequests/totalRequests)*100).toFixed(1)}%`, 'color: #8b5cf6;');
    return response;
  },
  (error) => {
    totalRequests += 1;
    failedRequests += 1;
    console.log(`%c[MindfulAI] Request Stats | Total: ${totalRequests} | Success: ${successfulRequests} | Failed: ${failedRequests} | Rate: ${((successfulRequests/totalRequests)*100).toFixed(1)}%`, 'color: #ef4444;');
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/token/', data),
  register: (data) => api.post('/users/register/', data),
  forgotPassword: (email) => api.post('/users/forgot-password/', { email }),
  resetPassword: (uid, token, new_password) => api.post('/users/reset-password/', { uid, token, new_password }),
};
export const sessionAPI = {
  startSession: (data) => api.post('/sessions/', data),
  getHistory: () => api.get('/sessions/history/'),
  getRecommendation: (emotion) => api.get(`/sessions/recommend/?emotion=${emotion}`),
};

export const interventionAPI = {
  getRecommendations: (emotion) => api.get(`/interventions/?emotion=${emotion}`),
};

export const escalationAPI = {
  getEscalation: () => api.get('/escalation/'),
  acknowledge: (id) => api.post(`/escalation/${id}/acknowledge/`),
};

export const communityAPI = {
  getPosts: () => api.get('/community/'),
  createPost: (data) => api.post('/community/', data),
  replyToPost: (id, data) => api.post(`/community/${id}/reply/`, data),
  deletePost: (id) => api.delete(`/community/${id}/delete/`),
};

export const adminAPI = {
  getStats: () => api.get('/users/admin/stats/'),
  getEmotionTrends: () => api.get('/users/admin/emotions/'),
  getEscalations: () => api.get('/users/admin/escalations/'),
  acknowledgeEscalation: (id) => api.post(`/users/admin/escalations/${id}/acknowledge/`),
};

export const privacyAPI = {
  downloadData: () => api.get('/users/privacy/download/'),
  deleteAccount: () => api.delete('/users/privacy/delete/'),
};



export default api;
