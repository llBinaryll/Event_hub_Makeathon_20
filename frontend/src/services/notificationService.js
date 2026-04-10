import api from './api';

export const notificationService = {
  getNotifications: async (unreadOnly = false) => {
    const params = unreadOnly ? '?unreadOnly=true' : '';
    const response = await api.get(`/notifications${params}`);
    return response.data.data || [];
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data.data || 0;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data.data;
  },
};
