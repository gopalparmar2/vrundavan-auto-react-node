import React, { useState } from 'react';
import authService from '@/services/authService';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Moon, Sun } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [infoSubmitting, setInfoSubmitting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [toast, setToast] = useState(null);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setInfoSubmitting(true);
    try {
      const updatedUser = await authService.updateProfile({ name, email });
      updateUser(updatedUser);
      setToast({ type: 'success', message: 'Profile information updated!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update info' });
    } finally {
      setInfoSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSubmitting(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setToast({ type: 'success', message: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to change password' });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout toast={toast} setToast={setToast}>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Account & Preference Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your executive profile, credentials, and visual theme preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info & Password Edit */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Info */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-indigo-500" /> Executive Profile Info
            </h3>

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={infoSubmitting} className="h-10 text-xs">
                {infoSubmitting ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-indigo-500" /> Security & Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={passwordSubmitting} className="h-10 text-xs">
                {passwordSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Theme Preference */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">Display Theme</h3>
            <p className="text-xs text-slate-500 mb-4">Choose application visual mode</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Moon className="w-5 h-5 mb-2 text-indigo-400" />
                <span className="text-xs">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Sun className="w-5 h-5 mb-2 text-amber-500" />
                <span className="text-xs">Light Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
