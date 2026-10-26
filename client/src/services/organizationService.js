import api from './api';

export const organizationService = {
  async getMyOrganizations() {
    const res = await api.get('/organizations');
    return res.data;
  },

  async createOrganization(data) {
    const res = await api.post('/organizations', data);
    return res.data;
  },

  async getOrganization(orgId) {
    const res = await api.get(`/organizations/${orgId}`);
    return res.data;
  },

  async updateOrganization(orgId, data) {
    const res = await api.patch(`/organizations/${orgId}`, data);
    return res.data;
  },

  async getMembers(orgId) {
    const res = await api.get(`/organizations/${orgId}/members`);
    return res.data;
  },

  async inviteMember(orgId, { email, role }) {
    const res = await api.post(`/organizations/${orgId}/invitations`, { email, role });
    return res.data;
  },

  async acceptInvitation(token) {
    const res = await api.post('/organizations/invitations/accept', { token });
    return res.data;
  },

  async removeMember(orgId, userId) {
    const res = await api.delete(`/organizations/${orgId}/members/${userId}`);
    return res.data;
  }
};
