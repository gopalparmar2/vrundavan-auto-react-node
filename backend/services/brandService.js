import Brand from '../models/Brand.js';
import VehicleModel from '../models/VehicleModel.js';

class BrandService {
  async getAllBrands(filter = {}) {
    return await Brand.find(filter).sort({ name: 1 });
  }

  async getBrandById(id) {
    const brand = await Brand.findById(id);
    if (!brand) throw { statusCode: 404, message: 'Brand not found' };
    return brand;
  }

  async getModelsByBrand(brandId) {
    return await VehicleModel.find({ brand: brandId }).sort({ name: 1 });
  }

  async createBrand({ name, logo, status }) {
    if (!name) throw { statusCode: 400, message: 'Brand name is required' };
    return await Brand.create({ name, logo: logo || '', status: status || 'active' });
  }

  async updateBrand(id, { name, logo, status }) {
    const brand = await Brand.findById(id);
    if (!brand) throw { statusCode: 404, message: 'Brand not found' };
    if (name) brand.name = name;
    if (logo !== undefined) brand.logo = logo;
    if (status) brand.status = status;
    return await brand.save();
  }

  async deleteBrand(id) {
    const brand = await Brand.findById(id);
    if (!brand) throw { statusCode: 404, message: 'Brand not found' };
    await VehicleModel.deleteMany({ brand: brand._id });
    await brand.deleteOne();
    return { message: 'Brand and associated models deleted' };
  }
}

export default new BrandService();
