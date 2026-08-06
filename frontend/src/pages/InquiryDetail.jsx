import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import inquiryService from '@/services/inquiryService';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Phone,
  Mail,
  User,
  Car,
  Tag,
  Clock,
  CheckCircle,
  FileText,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [statusLogs, setStatusLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchInquiryDetails = async () => {
    try {
      const data = await inquiryService.getInquiryById(id);
      if (data) {
        setInquiry(data.inquiry);
        setStatusLogs(data.statusLogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiryDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await inquiryService.updateStatus(id, newStatus);
      setToast({ type: 'success', message: `Status updated to ${newStatus}` });
      fetchInquiryDetails();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update status' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 text-center text-slate-500">Loading inquiry details...</div>
      </AuthenticatedLayout>
    );
  }

  if (!inquiry) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 text-center text-slate-500">Inquiry not found.</div>
      </AuthenticatedLayout>
    );
  }

  const statuses = ['New', 'Contacted', 'Estimate Sent', 'Negotiation', 'Converted', 'Lost'];

  const statusColors = {
    'New': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    'Contacted': 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40',
    'Estimate Sent': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40',
    'Negotiation': 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40',
    'Converted': 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40',
    'Lost': 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40',
  };

  return (
    <AuthenticatedLayout toast={toast} setToast={setToast}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/inquiries" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Pipeline
        </Link>

        <Link to={`/inquiries/${inquiry._id}/estimate`}>
          <Button className="h-10 text-xs">
            <FileText className="w-4 h-4 mr-2" /> Generate Cost Estimate
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Status Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${statusColors[inquiry.status]} uppercase tracking-wider`}>
                  {inquiry.status}
                </span>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
                  {inquiry.customer_name}
                </h2>
                <p className="text-xs text-slate-400">Inquiry ID: #{inquiry._id.substring(18)}</p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {inquiry.brand?.name} — {inquiry.model?.name}
                </div>
                <div className="text-xs text-slate-500">{inquiry.model?.variant}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3 text-xs">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="font-bold">{inquiry.phone}</span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>{inquiry.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>Executive: <strong>{inquiry.user?.name}</strong></span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Car className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>On-Road: <strong>₹ {Number(inquiry.model?.on_road_price || 0).toLocaleString('en-IN')}</strong></span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>Fuel / Trans: <strong>{inquiry.model?.fuel_type} / {inquiry.model?.transmission}</strong></span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>Created: <strong>{new Date(inquiry.createdAt).toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            {inquiry.notes && (
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Inquiry Notes</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{inquiry.notes}</p>
              </div>
            )}
          </div>

          {/* Status Progression Control */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Update Pipeline Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => (
                <Button
                  key={st}
                  variant={inquiry.status === st ? 'default' : 'outline'}
                  size="sm"
                  disabled={updating}
                  onClick={() => handleStatusChange(st)}
                  className="text-xs"
                >
                  {st}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Status Change History Audit Timeline */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-indigo-500" />
              Pipeline History Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {statusLogs.map((log) => (
                <div key={log._id} className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900" />
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Status changed to <span className="text-indigo-600 dark:text-indigo-400">{log.new_status}</span>
                  </div>
                  {log.old_status && (
                    <div className="text-[10px] text-slate-400">From {log.old_status}</div>
                  )}
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    By {log.changed_by?.name || 'User'} on {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
