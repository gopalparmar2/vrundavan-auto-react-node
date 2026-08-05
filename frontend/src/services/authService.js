import apiClient from './apiClient';

const authService = {
  async login(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data.data; // { _id, name, email, role, theme, token }
  },

  async register(userData) {
    const { data } = await apiClient.post('/auth/register', userData);
    return data.data;
  },

  async getMe() {
    const { data } = await apiClient.get('/auth/me');
    return data.data;
  },

  async updateProfile(profileData) {
    const { data } = await apiClient.patch('/auth/profile', profileData);
    return data.data;
  },

  async changePassword(current_password, new_password) {
    const { data } = await apiClient.patch('/auth/change-password', { current_password, new_password });
    return data;
  },

  async updateTheme(theme) {
    const { data } = await apiClient.patch('/auth/theme', { theme });
    return data.data;
  }
};

export default authService;
