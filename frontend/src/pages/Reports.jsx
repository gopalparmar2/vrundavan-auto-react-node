import React, { useState, useEffect } from 'react';
import reportService from '@/services/reportService';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { BarChart3, Download, FileText, Filter, Calendar } from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState({
    total: 0,
    statusCounts: { New: 0, Contacted: 0, 'Estimate Sent': 0, Negotiation: 0, Converted: 0, Lost: 0 },
    inquiries: []
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchReports = async () => {
    try {
      const data = await reportService.getReports({
        start_date: startDate,
        end_date: endDate,
        status: statusFilter
      });
      if (data) {
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate, statusFilter]);

  const handleExportCsv = async () => {
    try {
      const blob = await reportService.exportCsv({
        start_date: startDate,
        end_date: endDate,
        status: statusFilter
      });
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dealership_sales_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({ type: 'success', message: 'CSV Report Downloaded' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to export CSV report' });
    }
  };

  const handleExportPdf = async () => {
    try {
      const blob = await reportService.exportPdf({
        start_date: startDate,
        end_date: endDate,
        status: statusFilter
      });
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dealership_sales_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({ type: 'success', message: 'PDF Report Downloaded' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to export PDF report' });
    }
  };

  return (
    <AuthenticatedLayout toast={toast} setToast={setToast}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Performance & Pipeline Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Filter inquiries and export analytical reports in CSV or PDF formats
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button onClick={handleExportCsv} variant="outline" size="sm" className="h-10 text-xs">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={handleExportPdf} size="sm" className="h-10 text-xs bg-indigo-600 hover:bg-indigo-500">
            <FileText className="w-4 h-4 mr-2" /> Export PDF Report
          </Button>
        </div>
      </div>

      {/* Date & Filter Controls */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-2" /> Report Filter Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Pipeline Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Estimate Sent">Estimate Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(reportData.statusCounts).map(([statusName, count]) => (
          <div key={statusName} className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{statusName}</span>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{count}</div>
          </div>
        ))}
      </div>

      {/* Report Data Table */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Brand & Model</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Executive</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-200 font-medium">
              {reportData.inquiries.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{row.customer_name}</td>
                  <td className="px-6 py-4 text-slate-500">{row.phone}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">
                    {row.brand?.name} - {row.model?.name}
                  </td>
                  <td className="px-6 py-4 uppercase text-[10px]">{row.source}</td>
                  <td className="px-6 py-4 font-bold">{row.status}</td>
                  <td className="px-6 py-4 text-slate-500">{row.user?.name}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(row.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
