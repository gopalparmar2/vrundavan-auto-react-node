import modelService from '../services/modelService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getAllModels = async (req, res) => {
  try {
    const filter = {};
    if (req.query.brand_id) filter.brand = req.query.brand_id;
    const models = await modelService.getAllModels(filter);
    return sendSuccess(res, models, 'Models retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve models', err.statusCode || 500);
  }
};

export const getModelById = async (req, res) => {
  try {
    const model = await modelService.getModelById(req.params.id);
    return sendSuccess(res, model, 'Model retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Model not found', err.statusCode || 500);
  }
};

export const createModel = async (req, res) => {
  try {
    const model = await modelService.createModel(req.body);
    return sendSuccess(res, model, 'Vehicle model created successfully', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to create model', err.statusCode || 500);
  }
};

export const updateModel = async (req, res) => {
  try {
    const model = await modelService.updateModel(req.params.id, req.body);
    return sendSuccess(res, model, 'Vehicle model updated successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update model', err.statusCode || 500);
  }
};

export const deleteModel = async (req, res) => {
  try {
    const result = await modelService.deleteModel(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete model', err.statusCode || 500);
  }
};
