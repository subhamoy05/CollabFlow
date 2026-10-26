import api from './api';

export const adminService = {
  async getOverview() {
    const res = await api.get('/admin/overview');
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserStatus(userId, status) {
    const res = await api.patch(`/admin/users/${userId}/status`, { status });
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async getProjects(params = {}) {
    const res = await api.get('/admin/projects', { params });
    return res.data;
  },

  async getOrganizations() {
    const res = await api.get('/admin/organizations');
    return res.data;
  },

  async getAuditLogs(params = {}) {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },

  async getSettings() {
    const res = await api.get('/admin/settings');
    return res.data;
  },

  async updateSettings(settings) {
    const res = await api.patch('/admin/settings', settings);
    return res.data;
  }
};
