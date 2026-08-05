import apiClient from './apiClient';

const reportService = {
  async getReports(params = {}) {
    const { data } = await apiClient.get('/reports', { params });
    return data.data; // { total, statusCounts, inquiries }
  },

  async exportCsv(params = {}) {
    const response = await apiClient.get('/reports/export/csv', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  async exportPdf(params = {}) {
    const response = await apiClient.get('/reports/export/pdf', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default reportService;
