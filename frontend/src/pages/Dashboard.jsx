import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '@/services/dashboardService';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useAuth } from '@/context/AuthContext';
import {
  Tag,
  Car,
  UserPlus,
  BarChart3,
  Inbox,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    totalInquiriesMonth: 0,
    totalSalesMonth: 0,
    pendingEstimates: 0,
    recentInquiries: []
  });
  const [loading, setLoading] = useState(true);

  const statusColors = {
    'New': 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/30',
    'Contacted': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-900/30',
    'Estimate Sent': 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/30',
    'Negotiation': 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-900/30',
    'Converted': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/30',
    'Lost': 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/30',
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const stats = await dashboardService.getDashboardData();
        if (stats) {
          setData(stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const conversionRate = data.totalInquiriesMonth > 0 
    ? Math.round((data.totalSalesMonth / data.totalInquiriesMonth) * 100) 
    : 0;

  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <AuthenticatedLayout>
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-indigo-500/20 shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Showroom Management</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-1">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is an overview of your dealership's sales pipeline and active inquiries.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/inquiries?new=true"
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Lead</span>
          </Link>
        </div>
      </div>

      {/* 4-Column Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inquiries</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{data.totalInquiriesMonth}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Registered this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Converted Sales</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{data.totalSalesMonth}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Sales closed this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Estimates</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{data.pendingEstimates}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Estimates awaiting response</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{conversionRate}%</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Lead to sale ratio</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Quick Management Operations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link 
                to="/brands" 
                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all duration-200 group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Add Brand</span>
              </Link>

              <Link 
                to="/models" 
                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all duration-200 group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Add Model</span>
              </Link>

              <Link 
                to="/inquiries?new=true" 
                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all duration-200 group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">New Lead</span>
              </Link>

              <Link 
                to="/reports" 
                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all duration-200 group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Sales Reports</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Recent Customer Leads</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest vehicle inquiries received at showroom</p>
              </div>
              <Link 
                to="/inquiries" 
                className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <span>View All Pipeline</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {data.recentInquiries && data.recentInquiries.length > 0 ? (
                data.recentInquiries.map((inquiry) => (
                  <Link
                    key={inquiry._id}
                    to={`/inquiries/${inquiry._id}`}
                    className="block p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {inquiry.customer_name}
                          </span>
                          <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColors[inquiry.status] || 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'} uppercase tracking-wider`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Phone: <span className="font-semibold text-slate-700 dark:text-slate-300">{inquiry.phone}</span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {inquiry.brand?.name} — {inquiry.model?.name}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {timeAgo(inquiry.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200/80 dark:border-slate-800 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No inquiries registered yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Vehicle Catalog</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Quick links to inventory catalogs</p>

            <div className="space-y-3">
              <Link
                to="/brands"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Manage Brands</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">View manufacturer partners</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/models"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Vehicle Models</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Pricing & specifications</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/reports"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Performance Reports</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Monthly sales breakdown</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
