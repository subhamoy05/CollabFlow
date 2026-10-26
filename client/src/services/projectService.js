import api from './api';

export const projectService = {
  async getProjects(params = {}) {
    const res = await api.get('/projects', { params });
    return res.data;
  },

  async getProject(projectId) {
    const res = await api.get(`/projects/${projectId}`);
    return res.data;
  },

  async createProject(data) {
    const res = await api.post('/projects', data);
    return res.data;
  },

  async updateProject(projectId, data) {
    const res = await api.patch(`/projects/${projectId}`, data);
    return res.data;
  },

  async archiveProject(projectId) {
    const res = await api.post(`/projects/${projectId}/archive`);
    return res.data;
  },

  async restoreProject(projectId) {
    const res = await api.post(`/projects/${projectId}/restore`);
    return res.data;
  },

  async getMembers(projectId) {
    const res = await api.get(`/projects/${projectId}/members`);
    return res.data;
  },

  async addMember(projectId, { userId, role }) {
    const res = await api.post(`/projects/${projectId}/members`, { userId, role });
    return res.data;
  },

  async removeMember(projectId, memberUserId) {
    const res = await api.delete(`/projects/${projectId}/members/${memberUserId}`);
    return res.data;
  },

  async getActivity(projectId) {
    const res = await api.get(`/projects/${projectId}/activity`);
    return res.data;
  }
};
