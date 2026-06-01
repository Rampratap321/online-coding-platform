import api from '../utils/api';

export const getProblems = () => api.get('/problems');
export const getProblemById = (id) => api.get(`/problems/${id}`);
export const createProblem = (problem) => api.post('/problems/add', problem);
export const updateProblem = (id, problem) => api.put(`/problems/update/${id}`, problem);
export const deleteProblem = (id) => api.delete(`/problems/delete/${id}`);
