import brandService from '../services/brandService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getAllBrands = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const brands = await brandService.getAllBrands(filter);
    return sendSuccess(res, brands, 'Brands retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve brands', err.statusCode || 500);
  }
};

export const getBrandById = async (req, res) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    return sendSuccess(res, brand, 'Brand retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Brand not found', err.statusCode || 500);
  }
};

export const getModelsByBrand = async (req, res) => {
  try {
    const models = await brandService.getModelsByBrand(req.params.id);
    return sendSuccess(res, models, 'Models retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve models', err.statusCode || 500);
  }
};

export const createBrand = async (req, res) => {
  try {
    const brand = await brandService.createBrand(req.body);
    return sendSuccess(res, brand, 'Brand created successfully', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to create brand', err.statusCode || 500);
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    return sendSuccess(res, brand, 'Brand updated successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update brand', err.statusCode || 500);
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const result = await brandService.deleteBrand(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete brand', err.statusCode || 500);
  }
};
