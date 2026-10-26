import api from './api';

export const notificationService = {
  async getNotifications(params = {}) {
    const res = await api.get('/notifications', { params });
    return res.data;
  },

  async markAsRead(notificationId) {
    const res = await api.patch(`/notifications/${notificationId}/read`);
    return res.data;
  },

  async markAllAsRead() {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },

  async deleteNotification(notificationId) {
    const res = await api.delete(`/notifications/${notificationId}`);
    return res.data;
  }
};
