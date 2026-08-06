import apiClient from './apiClient';

const uploadService = {
  async uploadImage(file, type = 'brands') {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await apiClient.post(`/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Return the full uploaded image URL for preview and form state
    return data.data.url || data.data.filename;
  }
};

export default uploadService;
