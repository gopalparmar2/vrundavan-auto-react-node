import PDFDocument from 'pdfkit';
import Inquiry from '../models/Inquiry.js';

const buildFilter = ({ status, brand_id, start_date, end_date }) => {
  const filter = {};
  if (status) filter.status = status;
  if (brand_id) filter.brand = brand_id;
  if (start_date || end_date) {
    filter.createdAt = {};
    if (start_date) filter.createdAt.$gte = new Date(start_date);
    if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }
  return filter;
};

class ReportService {
  async getReportData(query) {
    const filter = buildFilter(query);
    const inquiries = await Inquiry.find(filter)
      .populate('brand', 'name')
      .populate('model', 'name variant on_road_price')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const statusCounts = { New: 0, Contacted: 0, 'Estimate Sent': 0, Negotiation: 0, Converted: 0, Lost: 0 };
    inquiries.forEach(item => { if (statusCounts[item.status] !== undefined) statusCounts[item.status]++; });

    return { total: inquiries.length, statusCounts, inquiries };
  }

  async generateCsv(query) {
    const filter = buildFilter(query);
    const inquiries = await Inquiry.find(filter)
      .populate('brand', 'name').populate('model', 'name variant on_road_price').populate('user', 'name')
      .sort({ createdAt: -1 });

    let csv = 'Customer Name,Phone,Email,Brand,Model,Variant,Source,Status,Sales Executive,Date\n';
    inquiries.forEach(item => {
      const row = [
        `"${item.customer_name.replace(/"/g, '""')}"`,
        `"${item.phone}"`, `"${item.email || ''}"`,
        `"${item.brand?.name || ''}"`, `"${item.model?.name || ''}"`, `"${item.model?.variant || ''}"`,
        `"${item.source}"`, `"${item.status}"`, `"${item.user?.name || ''}"`,
        `"${new Date(item.createdAt).toLocaleDateString()}"`
      ];
      csv += row.join(',') + '\n';
    });
    return csv;
  }

  async generatePdf(query, res) {
    const filter = buildFilter(query);
    const inquiries = await Inquiry.find(filter)
      .populate('brand', 'name').populate('model', 'name variant').populate('user', 'name')
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 40, layout: 'landscape' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dealership_sales_report.pdf');
    doc.pipe(res);

    doc.fillColor('#4f46e5').fontSize(20).text('Vrundavan Auto Dealership — Sales & Pipeline Report', { align: 'center' });
    doc.fontSize(10).fillColor('#6b7280').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1.5);
    doc.fontSize(12).fillColor('#1e293b').text(`Total Inquiries Exported: ${inquiries.length}`);
    doc.moveDown();
    const startY = doc.y;
    doc.fontSize(9).fillColor('#4f46e5');
    doc.text('Customer', 40, startY, { width: 110 });
    doc.text('Phone', 150, startY, { width: 90 });
    doc.text('Brand / Model', 240, startY, { width: 140 });
    doc.text('Source', 380, startY, { width: 70 });
    doc.text('Status', 450, startY, { width: 90 });
    doc.text('Sales Exec', 540, startY, { width: 100 });
    doc.text('Date', 650, startY, { width: 80 });
    doc.moveDown(0.5);
    doc.lineWidth(1).strokeColor('#e2e8f0').lineTo(750, doc.y).stroke();
    doc.moveDown(0.5);
    inquiries.forEach(item => {
      if (doc.y > 500) doc.addPage({ layout: 'landscape' });
      const y = doc.y;
      doc.fontSize(8).fillColor('#334155');
      doc.text(item.customer_name, 40, y, { width: 110 });
      doc.text(item.phone, 150, y, { width: 90 });
      doc.text(`${item.brand?.name || ''} - ${item.model?.name || ''}`, 240, y, { width: 140 });
      doc.text(item.source, 380, y, { width: 70 });
      doc.text(item.status, 450, y, { width: 90 });
      doc.text(item.user?.name || '', 540, y, { width: 100 });
      doc.text(new Date(item.createdAt).toLocaleDateString(), 650, y, { width: 80 });
      doc.moveDown(0.6);
    });
    doc.end();
  }
}

export default new ReportService();
