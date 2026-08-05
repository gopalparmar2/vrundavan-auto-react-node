import apiClient from './apiClient';

const dashboardService = {
  async getDashboardData() {
    const { data } = await apiClient.get('/dashboard');
    return data.data;
  }
};

export default dashboardService;
