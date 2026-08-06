import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authService.register({ name, email, password });
      login(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <img
            src="/app_icon.png"
            alt="Vrundavan Auto"
            className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-lg shadow-indigo-500/30 mb-3 border border-indigo-500/20"
          />
          <h1 className="text-2xl font-black text-white tracking-tight">Create Executive Account</h1>
          <p className="text-xs text-slate-400 mt-1">Register to start managing dealership pipeline</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300">Full Name</Label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300">Email Address</Label>
            <Input
              type="email"
              placeholder="sales@dealership.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-11 text-xs" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register & Continue'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
