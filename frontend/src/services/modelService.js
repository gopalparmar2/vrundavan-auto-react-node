import apiClient from './apiClient';

const modelService = {
  async getModels(params = {}) {
    const { data } = await apiClient.get('/models', { params });
    return data.data;
  },

  async getModelById(id) {
    const { data } = await apiClient.get(`/models/${id}`);
    return data.data;
  },

  async createModel(modelData) {
    const { data } = await apiClient.post('/models', modelData);
    return data.data;
  },

  async updateModel(id, modelData) {
    const { data } = await apiClient.put(`/models/${id}`, modelData);
    return data.data;
  },

  async deleteModel(id) {
    const { data } = await apiClient.delete(`/models/${id}`);
    return data;
  }
};

export default modelService;
