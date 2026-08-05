import PDFDocument from 'pdfkit';
import Estimate from '../models/Estimate.js';
import Inquiry from '../models/Inquiry.js';
import InquiryStatusLog from '../models/InquiryStatusLog.js';

class EstimateService {
  async createEstimate({ inquiry_id, on_road_price, discount, accessories_cost, insurance, rto_charges }, userId) {
    if (!inquiry_id || on_road_price === undefined) {
      throw { statusCode: 400, message: 'Inquiry ID and on-road price are required' };
    }
    const inquiry = await Inquiry.findById(inquiry_id).populate('brand model');
    if (!inquiry) throw { statusCode: 404, message: 'Inquiry not found' };

    const basePrice = Number(on_road_price);
    const disc = Number(discount || 0);
    const acc = Number(accessories_cost || 0);
    const ins = Number(insurance || 0);
    const rto = Number(rto_charges || 0);
    const totalAmount = basePrice - disc + acc + ins + rto;

    const estimate = await Estimate.create({
      inquiry: inquiry_id,
      on_road_price: basePrice,
      discount: disc,
      accessories_cost: acc,
      insurance: ins,
      rto_charges: rto,
      total_amount: totalAmount
    });

    if (['New', 'Contacted'].includes(inquiry.status)) {
      const oldStatus = inquiry.status;
      inquiry.status = 'Estimate Sent';
      await inquiry.save();
      await InquiryStatusLog.create({ inquiry: inquiry._id, old_status: oldStatus, new_status: 'Estimate Sent', changed_by: userId });
    }

    return await Estimate.findById(estimate._id).populate({ path: 'inquiry', populate: { path: 'brand model user' } });
  }

  async generatePdf(estimateId, res) {
    const estimate = await Estimate.findById(estimateId).populate({
      path: 'inquiry',
      populate: [{ path: 'brand' }, { path: 'model' }, { path: 'user' }]
    });
    if (!estimate) throw { statusCode: 404, message: 'Estimate not found' };

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Estimate_${estimate._id}.pdf`);
    doc.pipe(res);

    doc.fillColor('#4f46e5').fontSize(22).text('VRUNDAVAN AUTO DEALERSHIP', { align: 'center' });
    doc.fillColor('#6b7280').fontSize(10).text('Official Vehicle Cost Estimate', { align: 'center' });
    doc.moveDown(1.5);
    doc.fillColor('#1e293b').fontSize(14).text(`Estimate #${estimate._id.toString().substring(18)}`, { underline: true });
    doc.fontSize(10).fillColor('#475569').text(`Date: ${new Date(estimate.createdAt).toLocaleDateString('en-US', { dateStyle: 'full' })}`);
    doc.moveDown();
    doc.fillColor('#1e293b').fontSize(12).text('Customer Details', { bold: true });
    doc.fontSize(10).fillColor('#334155')
      .text(`Name: ${estimate.inquiry.customer_name}`)
      .text(`Phone: ${estimate.inquiry.phone}`)
      .text(`Email: ${estimate.inquiry.email || 'N/A'}`);
    doc.moveDown();
    doc.fillColor('#1e293b').fontSize(12).text('Vehicle Specification', { bold: true });
    doc.fontSize(10).fillColor('#334155')
      .text(`Brand: ${estimate.inquiry.brand?.name || 'N/A'}`)
      .text(`Model: ${estimate.inquiry.model?.name || 'N/A'} (${estimate.inquiry.model?.variant || ''})`)
      .text(`Fuel Type: ${estimate.inquiry.model?.fuel_type || 'N/A'}`)
      .text(`Transmission: ${estimate.inquiry.model?.transmission || 'N/A'}`);
    doc.moveDown();
    doc.fillColor('#4f46e5').fontSize(12).text('Cost Breakdown', { underline: true });
    doc.moveDown(0.5);
    [
      ['Base On-Road Price', `Rs. ${estimate.on_road_price.toLocaleString('en-IN')}`],
      ['Discount Offered', `- Rs. ${estimate.discount.toLocaleString('en-IN')}`],
      ['Accessories Cost', `+ Rs. ${estimate.accessories_cost.toLocaleString('en-IN')}`],
      ['Insurance Charges', `+ Rs. ${estimate.insurance.toLocaleString('en-IN')}`],
      ['RTO / Registration Charges', `+ Rs. ${estimate.rto_charges.toLocaleString('en-IN')}`],
    ].forEach(([label, val]) => {
      doc.fontSize(10).fillColor('#334155').text(label, 50, doc.y, { continued: true });
      doc.text(val, { align: 'right' });
    });
    doc.moveDown();
    doc.lineWidth(1).strokeColor('#e2e8f0').lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#1e1b4b').text('Final Net Payable Amount', 50, doc.y, { continued: true });
    doc.text(`Rs. ${estimate.total_amount.toLocaleString('en-IN')}`, { align: 'right' });
    doc.moveDown(2);
    doc.fontSize(9).fillColor('#94a3b8').text('Thank you for inquiring with Vrundavan Auto. Prices are subject to showroom policies.', { align: 'center' });
    doc.end();
  }
}

export default new EstimateService();
