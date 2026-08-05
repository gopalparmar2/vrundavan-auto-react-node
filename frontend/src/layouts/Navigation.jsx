import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Layers,
  Car,
  MessageSquare,
  BarChart3,
  Settings,
  X
} from 'lucide-react';

export default function Navigation({ isMobileOpen, setIsMobileOpen, collapsed }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/dashboard') return currentPath === '/dashboard' || currentPath === '/';
    return currentPath.startsWith(path);
  };

  const navItems = [
    {
      group: 'Core',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: Home },
      ]
    },
    {
      group: 'Inventory',
      items: [
        { label: 'Brands', path: '/brands', icon: Layers },
        { label: 'Models', path: '/models', icon: Car },
      ]
    },
    {
      group: 'Sales & CRM',
      items: [
        { label: 'Leads & Inquiries', path: '/inquiries', icon: MessageSquare },
        { label: 'Sales Reports', path: '/reports', icon: BarChart3 },
      ]
    },
    {
      group: 'Preferences',
      items: [
        { label: 'Settings', path: '/profile', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-white/90 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800/80 backdrop-blur-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
          <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              V
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Vrundavan Auto
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  Showroom Management
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {navItems.map((section, idx) => (
            <div key={idx}>
              {!collapsed && (
                <h4 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {section.group}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : ''}
                      className={`flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'} rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                        active
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 dark:bg-indigo-600 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'mr-3'} ${active ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                      {!collapsed && <span>{item.label}</span>}
                      {active && !collapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl z-10 border-r border-slate-200 dark:border-slate-800">
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                  V
                </div>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                  Vrundavan Auto
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {navItems.map((section, idx) => (
                <div key={idx}>
                  <h4 className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    {section.group}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-1.5rem)] w-[390px] z-40 bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800/80 px-2 py-1.5 rounded-2xl flex justify-around items-center shadow-xl shadow-black/10 dark:shadow-black/40 backdrop-blur-lg">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[9px] font-medium uppercase tracking-wide">Home</span>
        </Link>
        <Link
          to="/brands"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive('/brands') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[9px] font-medium uppercase tracking-wide">Brands</span>
        </Link>
        <Link
          to="/models"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive('/models') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Car className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[9px] font-medium uppercase tracking-wide">Models</span>
        </Link>
        <Link
          to="/inquiries"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive('/inquiries') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MessageSquare className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[9px] font-medium uppercase tracking-wide">Leads</span>
        </Link>
        <Link
          to="/reports"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive('/reports') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[9px] font-medium uppercase tracking-wide">Reports</span>
        </Link>
      </div>
    </>
  );
}
