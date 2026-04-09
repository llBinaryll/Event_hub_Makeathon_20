import api from './api';

export const recommendationService = {
  getPersonalizedRecommendations: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  },

  getUpcomingEvents: async (limit = 5) => {
    const response = await api.get(`/recommendations/upcoming?limit=${limit}`);
    return response.data;
  },

  getSimilarEvents: async (eventId, limit = 5) => {
    const response = await api.get(`/recommendations/similar/${eventId}?limit=${limit}`);
    return response.data;
  },

  getPopularEvents: async (limit = 5) => {
    const response = await api.get(`/recommendations/popular?limit=${limit}`);
    return response.data;
  },
};
