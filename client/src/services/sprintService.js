import api from './api';

export const sprintService = {
  async getSprints(projectId) {
    const res = await api.get('/sprints', { params: { projectId } });
    return res.data;
  },

  async createSprint(data) {
    const res = await api.post('/sprints', data);
    return res.data;
  },

  async updateSprint(sprintId, data) {
    const res = await api.patch(`/sprints/${sprintId}`, data);
    return res.data;
  },

  async startSprint(sprintId) {
    const res = await api.post(`/sprints/${sprintId}/start`);
    return res.data;
  },

  async completeSprint(sprintId) {
    const res = await api.post(`/sprints/${sprintId}/complete`);
    return res.data;
  }
};
