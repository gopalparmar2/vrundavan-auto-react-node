import apiClient from './apiClient';

const brandService = {
  async getBrands(params = {}) {
    const { data } = await apiClient.get('/brands', { params });
    return data.data;
  },

  async getBrandById(id) {
    const { data } = await apiClient.get(`/brands/${id}`);
    return data.data;
  },

  async getModelsByBrand(brandId) {
    const { data } = await apiClient.get(`/brands/${brandId}/models`);
    return data.data;
  },

  async createBrand(brandData) {
    const { data } = await apiClient.post('/brands', brandData);
    return data.data;
  },

  async updateBrand(id, brandData) {
    const { data } = await apiClient.put(`/brands/${id}`, brandData);
    return data.data;
  },

  async deleteBrand(id) {
    const { data } = await apiClient.delete(`/brands/${id}`);
    return data;
  }
};

export default brandService;
