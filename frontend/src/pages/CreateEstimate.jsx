import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import inquiryService from '@/services/inquiryService';
import estimateService from '@/services/estimateService';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, Download, CheckCircle, Calculator } from 'lucide-react';

export default function CreateEstimate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [onRoadPrice, setOnRoadPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [accessoriesCost, setAccessoriesCost] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [rtoCharges, setRtoCharges] = useState(0);

  const [generatedEstimate, setGeneratedEstimate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const data = await inquiryService.getInquiryById(id);
        if (data && data.inquiry) {
          setInquiry(data.inquiry);
          const price = Number(data.inquiry.model?.on_road_price || 0);
          setOnRoadPrice(price);
          setInsurance(Math.round(price * 0.03)); // default ~3% insurance estimate
          setRtoCharges(Math.round(price * 0.08)); // default ~8% RTO estimate
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiry();
  }, [id]);

  const totalAmount = Number(onRoadPrice || 0) - Number(discount || 0) + Number(accessoriesCost || 0) + Number(insurance || 0) + Number(rtoCharges || 0);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const estimate = await estimateService.createEstimate({
        inquiry_id: id,
        on_road_price: onRoadPrice,
        discount,
        accessories_cost: accessoriesCost,
        insurance,
        rto_charges: rtoCharges
      });
      setGeneratedEstimate(estimate);
      setToast({ type: 'success', message: 'Estimate generated successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to generate estimate' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = async (estimateId) => {
    try {
      const blob = await estimateService.downloadEstimatePdf(estimateId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Estimate_${estimateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to download PDF estimate' });
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 text-center text-slate-500">Loading estimate workspace...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout toast={toast} setToast={setToast}>
      <div className="mb-6 flex items-center justify-between">
        <Link to={`/inquiries/${id}`} className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Inquiry Details
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Generate Cost Estimate
            </h2>
            <p className="text-xs text-slate-500 mb-6">Customize discounts, accessories, and registration breakdown</p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Base On-Road Price (₹)</Label>
                <Input
                  type="number"
                  value={onRoadPrice}
                  onChange={(e) => setOnRoadPrice(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Discount Offered (₹)</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Accessories Package Cost (₹)</Label>
                  <Input
                    type="number"
                    value={accessoriesCost}
                    onChange={(e) => setAccessoriesCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Insurance Policy Cost (₹)</Label>
                  <Input
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>RTO / Registration Charges (₹)</Label>
                  <Input
                    type="number"
                    value={rtoCharges}
                    onChange={(e) => setRtoCharges(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 mt-4 text-xs" disabled={submitting}>
                {submitting ? 'Calculating...' : 'Generate & Save Estimate'}
              </Button>
            </form>
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Breakdown Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Base On-Road:</span>
                <span className="font-bold">₹ {Number(onRoadPrice).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-rose-600 dark:text-rose-400">
                <span>Discount:</span>
                <span className="font-bold">- ₹ {Number(discount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Accessories:</span>
                <span className="font-bold">+ ₹ {Number(accessoriesCost).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Insurance:</span>
                <span className="font-bold">+ ₹ {Number(insurance).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>RTO / Reg:</span>
                <span className="font-bold">+ ₹ {Number(rtoCharges).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Total Payable:</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  ₹ {Number(totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {generatedEstimate && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => handleDownloadPdf(generatedEstimate._id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF Estimate
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
