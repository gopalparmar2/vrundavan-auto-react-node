import apiClient from './apiClient';

const estimateService = {
  async createEstimate(estimateData) {
    const { data } = await apiClient.post('/estimates', estimateData);
    return data.data;
  },

  async downloadEstimatePdf(estimateId) {
    const response = await apiClient.get(`/estimates/${estimateId}/download`, {
      responseType: 'blob'
    });
    return response.data; // blob
  }
};

export default estimateService;
