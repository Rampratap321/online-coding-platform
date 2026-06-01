import api from '../utils/api';

export const getLeaderboard = () => api.get('/leaderboard');
