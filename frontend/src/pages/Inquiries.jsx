import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import inquiryService from '@/services/inquiryService';
import brandService from '@/services/brandService';
import apiClient from '@/services/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { UserPlus, Eye, Phone, Users, X } from 'lucide-react';

const STATUS_COLORS = {
  'New': 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/30',
  'Contacted': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-900/30',
  'Estimate Sent': 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/30',
  'Negotiation': 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-900/30',
  'Converted': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/30',
  'Lost': 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/30',
};

export default function Inquiries() {
  const [searchParams] = useSearchParams();
  const [inquiries, setInquiries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // New Lead Dialog
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('new') === 'true');
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    brand_id: '',
    model_id: '',
    source: 'walk-in',
    notes: '',
    status: 'New'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchInquiries = async () => {
    try {
      const data = await inquiryService.getInquiries();
      setInquiries(data);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandsAndModels = async () => {
    try {
      const brandsData = await brandService.getBrands({ status: 'active' });
      setBrands(brandsData);
      if (brandsData.length > 0) {
        setFormData(prev => ({ ...prev, brand_id: brandsData[0]._id }));
        const modelsData = await brandService.getModelsByBrand(brandsData[0]._id);
        setModels(modelsData);
        if (modelsData.length > 0) {
          setFormData(prev => ({ ...prev, model_id: modelsData[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);
  useEffect(() => { fetchBrandsAndModels(); }, []);

  const handleBrandChange = async (brandId) => {
    setFormData(prev => ({ ...prev, brand_id: brandId, model_id: '' }));
    try {
      const modelsData = await brandService.getModelsByBrand(brandId);
      setModels(modelsData);
      if (modelsData.length > 0) {
        setFormData(prev => ({ ...prev, model_id: modelsData[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inquiryService.createInquiry(formData);
      setToast({ type: 'success', message: 'Lead registered successfully!' });
      setIsModalOpen(false);
      fetchInquiries();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Client-side filters (status + date range) ── */
  const filteredData = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter && inq.status !== statusFilter) return false;
      if (dateFrom) {
        const created = new Date(inq.createdAt);
        const from = new Date(dateFrom);
        if (created < from) return false;
      }
      if (dateTo) {
        const created = new Date(inq.createdAt);
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (created > to) return false;
      }
      return true;
    });
  }, [inquiries, statusFilter, dateFrom, dateTo]);

  const hasFilters = statusFilter || dateFrom || dateTo;

  /* ── Table columns ── */
  const columns = [
    {
      key: 'customer_name',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-100">{row.customer_name}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" /> {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'brand.name',
      label: 'Vehicle',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-bold text-indigo-600 dark:text-indigo-400">
            {row.brand?.name} – {row.model?.name}
          </div>
          <div className="text-[11px] text-slate-400">{row.model?.variant}</div>
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      render: (row) => (
        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
          {row.source}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${STATUS_COLORS[row.status] || ''}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: 'user.name',
      label: 'Assigned',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
          {row.user?.name || 'Executive'}
        </span>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <Link to={`/inquiries/${row._id}`}>
          <Button variant="outline" size="sm">
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>
        </Link>
      ),
    },
  ];

  /* ── Extra filter controls ── */
  const extraFilters = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="w-full sm:w-48">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Estimate Sent">Estimate Sent</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </Select>
      </div>
      <div className="w-full sm:w-44">
        <DatePicker
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From date"
          className="h-11"
        />
      </div>
      <div className="w-full sm:w-44">
        <DatePicker
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To date"
          className="h-11"
        />
      </div>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="self-center"
          onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); }}
        >
          <X className="w-3.5 h-3.5 mr-1" /> Clear
        </Button>
      )}
    </div>
  );

  return (
    <AuthenticatedLayout toast={toast} setToast={setToast}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Customer Pipeline & Leads
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track inquiries, status progression and estimate requests
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-10 text-xs">
          <UserPlus className="w-4 h-4 mr-2" /> Register New Lead
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        searchKeys={['customer_name', 'phone', 'email', 'brand.name', 'model.name', 'model.variant']}
        searchPlaceholder="Search by customer, phone, email or vehicle..."
        emptyIcon={<Users className="w-12 h-12" />}
        emptyLabel="No inquiries found. Register your first lead."
        extraFilters={extraFilters}
      />

      {/* New Lead Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Register Customer Lead</DialogTitle>
            <DialogDescription>Fill in customer details and vehicle requirement.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Customer Name</Label>
              <Input
                type="text"
                placeholder="e.g. Rajesh Sharma"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email (Optional)</Label>
                <Input
                  type="email"
                  placeholder="rajesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Brand Choice</Label>
                <Select
                  value={formData.brand_id}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  required
                >
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Vehicle Model</Label>
                <Select
                  value={formData.model_id}
                  onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                  required
                >
                  {models.map((m) => (
                    <option key={m._id} value={m._id}>{m.name} ({m.variant})</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Inquiry Source</Label>
                <Select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="walk-in">Walk-In</option>
                  <option value="phone">Phone Call</option>
                  <option value="online">Online Lead</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Initial Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Notes & Customer Preferences</Label>
              <Textarea
                placeholder="Exchange request, color choice, test drive time..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Registering...' : 'Register Lead'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
