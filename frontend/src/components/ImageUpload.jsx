import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import uploadService from '@/services/uploadService';

export default function ImageUpload({ value, onChange, label = 'Image', type = 'brands' }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const uploadedFilename = await uploadService.uploadImage(file, type);
      onChange(uploadedFilename);
    } catch (err) {
      console.error('Image upload error:', err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const getPreviewUrl = (val, folderType) => {
    if (!val) return '';
    if (val.startsWith('http://') || val.startsWith('https://')) {
      return val;
    }
    if (val.startsWith('/uploads/') || val.startsWith('/assets/')) {
      return val;
    }
    return `/uploads/${folderType}/${val}`;
  };

  const isPlaceholderImage = (val) => {
    if (!val) return true;
    return val.includes('placeholder') || val.includes('app_icon.png');
  };

  const hasValidImage = Boolean(value && !isPlaceholderImage(value));
  const previewSrc = getPreviewUrl(value, type);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {hasValidImage ? (
        <div className="relative group w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-2">
          <img
            key={previewSrc}
            src={previewSrc}
            alt="Preview"
            className="max-h-full max-w-full object-contain rounded-lg shadow-xs"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-transform group-hover:scale-105"
            title="Remove Image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
          {loading ? (
            <div className="flex flex-col items-center space-y-1.5 text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1.5 text-slate-500 dark:text-slate-400">
              <Upload className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click to upload image file
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, WEBP, GIF (Max 10MB)</span>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
