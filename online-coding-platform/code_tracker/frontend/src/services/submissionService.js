import api from '../utils/api';

export const submitCode = (problemId, code, language) => api.post('/submissions/submit', { problemId, code, language });
export const getUserSubmissions = (userId) => api.get(`/submissions/user/${userId}`);
export const getProblemSubmissions = (problemId) => api.get(`/submissions/problem/${problemId}`);
