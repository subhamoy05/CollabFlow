import api from './api';

export const taskService = {
  async getTasks(params = {}) {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  async getTask(taskId) {
    const res = await api.get(`/tasks/${taskId}`);
    return res.data;
  },

  async createTask(data) {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  async updateTask(taskId, data) {
    const res = await api.patch(`/tasks/${taskId}`, data);
    return res.data;
  },

  async moveTask(taskId, { status, order }) {
    const res = await api.patch(`/tasks/${taskId}/move`, { status, order });
    return res.data;
  },

  async deleteTask(taskId) {
    const res = await api.delete(`/tasks/${taskId}`);
    return res.data;
  },

  async getComments(taskId) {
    const res = await api.get(`/tasks/${taskId}/comments`);
    return res.data;
  },

  async addComment(taskId, content) {
    const res = await api.post(`/tasks/${taskId}/comments`, { content });
    return res.data;
  },

  async addChecklistItem(taskId, text) {
    const res = await api.post(`/tasks/${taskId}/checklist`, { text });
    return res.data;
  },

  async toggleChecklistItem(taskId, itemId) {
    const res = await api.patch(`/tasks/${taskId}/checklist/${itemId}/toggle`);
    return res.data;
  },

  async removeChecklistItem(taskId, itemId) {
    const res = await api.delete(`/tasks/${taskId}/checklist/${itemId}`);
    return res.data;
  }
};
