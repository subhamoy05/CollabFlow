import api from './api';

export const chatService = {
  async getMessages(projectId, params = {}) {
    const res = await api.get(`/chat/${projectId}/messages`, { params });
    return res.data;
  },

  async sendMessage(projectId, { content, replyTo, attachments }) {
    const res = await api.post(`/chat/${projectId}/messages`, { content, replyTo, attachments });
    return res.data;
  },

  async editMessage(messageId, content) {
    const res = await api.patch(`/chat/messages/${messageId}`, { content });
    return res.data;
  },

  async deleteMessage(messageId) {
    const res = await api.delete(`/chat/messages/${messageId}`);
    return res.data;
  }
};
