import React, { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { Plus, Edit, Trash2, Car, Gauge } from 'lucide-react';
import modelService from '@/services/modelService';
import brandService from '@/services/brandService';
import ImageUpload from '@/components/ImageUpload';

const fuelColors = {
  Petrol: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200/60 dark:border-orange-900/40',
  Diesel: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  Electric: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40',
  CNG: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40',
  Hybrid: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-900/40',
};

export default function Models() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [brandFilter, setBrandFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [formData, setFormData] = useState({ brand_id: '', name: '', variant: '', on_road_price: '', ex_showroom_price: '', fuel_type: 'Petrol', transmission: 'Manual', image: '' });
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [modelsData, brandsData] = await Promise.all([modelService.getModels(), brandService.getBrands()]);
      setModels(modelsData);
      setBrands(brandsData);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = () => {
    setEditingModel(null);
    setFormData({ brand_id: brands[0]?._id || '', name: '', variant: '', on_road_price: '', ex_showroom_price: '', fuel_type: 'Petrol', transmission: 'Manual', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (model) => {
    setEditingModel(model);
    setFormData({ brand_id: model.brand?._id || model.brand, name: model.name, variant: model.variant, on_road_price: model.on_road_price, ex_showroom_price: model.ex_showroom_price || '', fuel_type: model.fuel_type, transmission: model.transmission, image: model.image || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingModel) {
        await modelService.updateModel(editingModel._id, formData);
        setToast({ type: 'success', message: 'Vehicle model updated successfully!' });
      } else {
        await modelService.createModel(formData);
        setToast({ type: 'success', message: 'Vehicle model created successfully!' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await modelService.deleteModel(deleteTarget._id);
      setToast({ type: 'success', message: `"${deleteTarget.name}" deleted successfully.` });
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const filteredModels = useMemo(() =>
    brandFilter ? models.filter((m) => (m.brand?._id || m.brand) === brandFilter) : models,
    [models, brandFilter]
  );

  const columns = [
    {
      key: 'brand.name',
      label: 'Brand',
      sortable: true,
      render: (row) => (
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40 uppercase tracking-wider">
          {row.brand?.name || '—'}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Model Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image || '/app_icon.png'}
            alt={row.name}
            className="w-8 h-8 rounded-xl object-cover border border-indigo-100 dark:border-indigo-900/40 flex-shrink-0"
          />
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{row.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{row.variant}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'fuel_type',
      label: 'Fuel / Trans.',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start ${fuelColors[row.fuel_type] || fuelColors.Petrol}`}>{row.fuel_type}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1"><Gauge className="w-3 h-3" /> {row.transmission}</span>
        </div>
      ),
    },
    {
      key: 'on_road_price',
      label: 'On-Road Price',
      sortable: true,
      sortValue: (row) => Number(row.on_road_price),
      render: (row) => (
        <div>
          <div className="font-black text-indigo-600 dark:text-indigo-400 text-sm">₹ {Number(row.on_road_price).toLocaleString('en-IN')}</div>
          {row.ex_showroom_price > 0 && <div className="text-[11px] text-slate-400 mt-0.5">Ex: ₹ {Number(row.ex_showroom_price).toLocaleString('en-IN')}</div>}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}><Edit className="w-3.5 h-3.5 mr-1" /> Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(row)}><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      ),
    },
  ];

  const brandFilterEl = (
    <div className="w-full sm:w-48">
      <Select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
        <option value="">All Brands</option>
        {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
      </Select>
    </div>
  );

  return (
    <AuthenticatedLayout toast={toast} setToast={setToast}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Vehicle Models Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pricing, variant specifications and stock options</p>
        </div>
        <Button onClick={handleOpenCreate} className="h-10 text-xs"><Plus className="w-4 h-4 mr-2" /> Add Vehicle Model</Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredModels}
        loading={loading}
        searchKeys={['name', 'variant', 'brand.name', 'fuel_type', 'transmission']}
        searchPlaceholder="Search by model, variant or brand..."
        emptyIcon={<Car className="w-12 h-12" />}
        emptyLabel="No vehicle models found."
        extraFilters={brandFilterEl}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingModel ? 'Edit Vehicle Model' : 'Add New Vehicle Model'}</DialogTitle>
            <DialogDescription>Enter model specifications and pricing details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Brand Partner</Label>
                <Select value={formData.brand_id} onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })} required>
                  {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Model Name</Label>
                <Input type="text" placeholder="e.g. Harrier" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Variant</Label>
              <Input type="text" placeholder="e.g. Fearless Plus Dark Edition" value={formData.variant} onChange={(e) => setFormData({ ...formData, variant: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>On Road Price (₹)</Label>
                <Input type="number" placeholder="2650000" value={formData.on_road_price} onChange={(e) => setFormData({ ...formData, on_road_price: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Ex-Showroom Price (₹)</Label>
                <Input type="number" placeholder="2350000" value={formData.ex_showroom_price} onChange={(e) => setFormData({ ...formData, ex_showroom_price: e.target.value })} />
              </div>
            </div>
            <ImageUpload
              label="Vehicle Model Image"
              type="models"
              value={formData.image}
              onChange={(imgVal) => setFormData({ ...formData, image: imgVal })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Fuel Type</Label>
                <Select value={formData.fuel_type} onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}>
                  <option value="Petrol">Petrol</option><option value="Diesel">Diesel</option><option value="CNG">CNG</option><option value="Electric">Electric</option><option value="Hybrid">Hybrid</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Transmission</Label>
                <Select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}>
                  <option value="Manual">Manual</option><option value="Automatic">Automatic</option>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editingModel ? 'Update Model' : 'Create Model'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Vehicle Model?"
        description={`Permanently delete "${deleteTarget?.name} — ${deleteTarget?.variant}". This cannot be undone.`}
        confirmLabel="Delete Model"
      />
    </AuthenticatedLayout>
  );
}
