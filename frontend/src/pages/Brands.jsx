import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import brandService from '@/services/brandService';
import ImageUpload from '@/components/ImageUpload';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo: '', status: 'active' });
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBrands = async () => {
    try {
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormData({ name: '', logo: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo: brand.logo || '', status: brand.status });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand._id, formData);
        setToast({ type: 'success', message: 'Brand updated successfully!' });
      } else {
        await brandService.createBrand(formData);
        setToast({ type: 'success', message: 'New brand added successfully!' });
      }
      setIsModalOpen(false);
      fetchBrands();
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
      await brandService.deleteBrand(deleteTarget._id);
      setToast({ type: 'success', message: `"${deleteTarget.name}" deleted successfully.` });
      setDeleteTarget(null);
      fetchBrands();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Brand Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.logo || '/app_icon.png'}
            alt={row.name}
            className="w-8 h-8 rounded-xl object-cover border border-indigo-100 dark:border-indigo-900/40 flex-shrink-0"
          />
          <span className="font-bold text-slate-800 dark:text-slate-100">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
          row.status === 'active'
            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
        }`}>{row.status}</span>
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
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(row)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AuthenticatedLayout toast={toast} setToast={setToast}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Vehicle Brands Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage manufacturer brand partnerships for showroom sales</p>
        </div>
        <Button onClick={handleOpenCreate} className="h-10 text-xs">
          <Plus className="w-4 h-4 mr-2" /> Add Manufacturer Brand
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={brands}
        loading={loading}
        searchKeys={['name', 'status']}
        searchPlaceholder="Search brands by name or status..."
        emptyIcon={<Tag className="w-12 h-12" />}
        emptyLabel="No brands found. Add your first manufacturer brand."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Edit Manufacturer Brand' : 'Add New Manufacturer Brand'}</DialogTitle>
            <DialogDescription>Fill out brand details to register in inventory catalog.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Brand Name</Label>
              <Input type="text" placeholder="e.g. Tata Motors" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <ImageUpload
              label="Brand Logo"
              type="brands"
              value={formData.logo}
              onChange={(logoVal) => setFormData({ ...formData, logo: logoVal })}
            />
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editingBrand ? 'Update Brand' : 'Create Brand'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Brand?"
        description={`This will permanently delete "${deleteTarget?.name}" and all its associated vehicle models. This action cannot be undone.`}
        confirmLabel="Delete Brand"
      />
    </AuthenticatedLayout>
  );
}
