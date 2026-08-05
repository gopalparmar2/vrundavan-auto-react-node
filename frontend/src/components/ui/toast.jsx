import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast || !toast.message) return null;

  const { type, message } = toast;

  // Auto-dismiss after 4s
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const isDestructive = type === 'error' || type === 'destructive';

  const variantStyles = {
    success: 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60',
    error: 'bg-rose-600 border-rose-700',
    destructive: 'bg-rose-600 border-rose-700',
    info: 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60',
    default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
  };

  const iconEl = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />,
    destructive: <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
    default: <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />,
  };

  const titleEl = {
    success: <span className="text-emerald-700 dark:text-emerald-400">Success</span>,
    error: <span className="text-white">Error</span>,
    destructive: <span className="text-white">Error</span>,
    info: <span className="text-indigo-700 dark:text-indigo-300">Notification</span>,
    default: <span className="text-slate-800 dark:text-slate-100">Notification</span>,
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className={`relative flex items-start justify-between space-x-3 rounded-2xl border p-4 shadow-xl transition-all ${variantStyles[type] || variantStyles.default}`}>
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className="flex-shrink-0 pt-0.5">
            {iconEl[type] || iconEl.default}
          </div>
          <div className="grid gap-0.5 min-w-0">
            <div className="text-xs font-bold leading-none tracking-tight">
              {titleEl[type] || titleEl.default}
            </div>
            <div className={`text-xs leading-normal mt-0.5 ${isDestructive ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
              {message}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none flex-shrink-0 ${isDestructive ? 'text-white hover:bg-white/20' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
