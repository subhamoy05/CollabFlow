import api, { setAccessToken } from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.patch('/auth/profile', profileData);
    return res.data;
  },

  async forgotPassword(email) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token, password, confirmPassword) {
    const res = await api.post('/auth/reset-password', { token, password, confirmPassword });
    return res.data;
  }
};
