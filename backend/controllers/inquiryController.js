import inquiryService from '../services/inquiryService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await inquiryService.getAllInquiries(req.query);
    return sendSuccess(res, inquiries, 'Inquiries retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve inquiries', err.statusCode || 500);
  }
};

export const getInquiryById = async (req, res) => {
  try {
    const { inquiry, statusLogs } = await inquiryService.getInquiryById(req.params.id);
    return sendSuccess(res, { inquiry, statusLogs }, 'Inquiry retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Inquiry not found', err.statusCode || 500);
  }
};

export const createInquiry = async (req, res) => {
  try {
    const inquiry = await inquiryService.createInquiry(req.body, req.user._id);
    return sendSuccess(res, inquiry, 'Lead registered successfully', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to create inquiry', err.statusCode || 500);
  }
};

export const updateInquiry = async (req, res) => {
  try {
    const inquiry = await inquiryService.updateInquiry(req.params.id, req.body, req.user._id);
    return sendSuccess(res, inquiry, 'Inquiry updated successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update inquiry', err.statusCode || 500);
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status, req.user._id);
    return sendSuccess(res, inquiry, 'Status updated successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update status', err.statusCode || 500);
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const result = await inquiryService.deleteInquiry(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete inquiry', err.statusCode || 500);
  }
};
