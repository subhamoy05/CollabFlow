import api from './api';

export const reportService = {
  async getOverview() {
    const res = await api.get('/reports/overview');
    return res.data;
  },

  async getProjectReport(projectId) {
    const res = await api.get(`/reports/projects/${projectId}`);
    return res.data;
  },

  async downloadCsv(projectId = null) {
    const params = projectId ? { projectId } : {};
    const res = await api.get('/reports/export.csv', {
      params,
      responseType: 'blob'
    });

    // Create download link
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `collabflow-tasks-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
