import reportService from '../services/reportService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getReports = async (req, res) => {
  try {
    const data = await reportService.getReportData(req.query);
    return sendSuccess(res, data, 'Report data retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve report data', err.statusCode || 500);
  }
};

export const exportCsv = async (req, res) => {
  try {
    const csv = await reportService.generateCsv(req.query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dealership_sales_report.csv');
    return res.status(200).send(csv);
  } catch (err) {
    return sendError(res, err.message || 'Failed to export CSV', err.statusCode || 500);
  }
};

export const exportPdf = async (req, res) => {
  try {
    await reportService.generatePdf(req.query, res);
  } catch (err) {
    return sendError(res, err.message || 'Failed to export PDF', err.statusCode || 500);
  }
};
