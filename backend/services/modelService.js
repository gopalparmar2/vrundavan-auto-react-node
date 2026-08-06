import VehicleModel from '../models/VehicleModel.js';
import { deleteUploadFile } from '../utils/fileHelper.js';

class ModelService {
  async getAllModels(filter = {}) {
    return await VehicleModel.find(filter)
      .populate('brand', 'name logo status')
      .sort({ name: 1 });
  }

  async getModelById(id) {
    const model = await VehicleModel.findById(id).populate('brand', 'name logo status');
    if (!model) throw { statusCode: 404, message: 'Vehicle model not found' };
    return model;
  }

  async createModel({ brand_id, name, variant, on_road_price, ex_showroom_price, fuel_type, transmission, image }) {
    if (!brand_id || !name || !variant || !on_road_price || !fuel_type || !transmission) {
      throw { statusCode: 400, message: 'Missing required vehicle model fields' };
    }
    const model = await VehicleModel.create({
      brand: brand_id,
      name,
      variant,
      on_road_price: Number(on_road_price),
      ex_showroom_price: ex_showroom_price ? Number(ex_showroom_price) : 0,
      fuel_type,
      transmission,
      image: image || ''
    });
    return await VehicleModel.findById(model._id).populate('brand', 'name logo status');
  }

  async updateModel(id, { brand_id, name, variant, on_road_price, ex_showroom_price, fuel_type, transmission, image }) {
    const model = await VehicleModel.findById(id);
    if (!model) throw { statusCode: 404, message: 'Vehicle model not found' };

    if (brand_id) model.brand = brand_id;
    if (name) model.name = name;
    if (variant) model.variant = variant;
    if (on_road_price !== undefined) model.on_road_price = Number(on_road_price);
    if (ex_showroom_price !== undefined) model.ex_showroom_price = Number(ex_showroom_price);
    if (fuel_type) model.fuel_type = fuel_type;
    if (transmission) model.transmission = transmission;
    if (image !== undefined) {
      if (model.image && model.image !== image) {
        deleteUploadFile('models', model.image);
      }
      model.image = image;
    }
    await model.save();
    return await VehicleModel.findById(model._id).populate('brand', 'name logo status');
  }

  async deleteModel(id) {
    const model = await VehicleModel.findById(id);
    if (!model) throw { statusCode: 404, message: 'Vehicle model not found' };
    if (model.image) {
      deleteUploadFile('models', model.image);
    }
    await model.deleteOne();
    return { message: 'Vehicle model deleted' };
  }
}

export default new ModelService();
