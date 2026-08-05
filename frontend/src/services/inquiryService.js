import apiClient from './apiClient';

const inquiryService = {
  async getInquiries(params = {}) {
    const { data } = await apiClient.get('/inquiries', { params });
    return data.data;
  },

  async getInquiryById(id) {
    const { data } = await apiClient.get(`/inquiries/${id}`);
    return data.data; // { inquiry, statusLogs }
  },

  async createInquiry(inquiryData) {
    const { data } = await apiClient.post('/inquiries', inquiryData);
    return data.data;
  },

  async updateInquiry(id, inquiryData) {
    const { data } = await apiClient.put(`/inquiries/${id}`, inquiryData);
    return data.data;
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`/inquiries/${id}/status`, { status });
    return data.data;
  },

  async deleteInquiry(id) {
    const { data } = await apiClient.delete(`/inquiries/${id}`);
    return data;
  }
};

export default inquiryService;
