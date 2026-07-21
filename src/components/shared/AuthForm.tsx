'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Handle Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // On success, we will push them to their dashboard (we will build this later)
        setMessage('✅ Logged in successfully! Redirecting...');
        setTimeout(() => router.push('/register-profile'), 1000); 
        
      } else {
        // Handle Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // 1. Check if Supabase requires email verification
        if (data.user && data.user.identities && data.user.identities.length === 0) {
           setMessage('❌ Email already in use. Please log in.');
           return;
        }

        // 2. Insert into our custom public.users table
        if (data.user) {
          const { error: dbError } = await supabase.from('users').insert([{
            id: data.user.id,
            email: data.user.email,
            password_hash: 'managed_by_supabase_auth',
            user_type: 'candidate' // Defaulting to candidate for now
          }]);
          
          if (dbError) throw dbError;
        }

        setMessage('✨ Account created! Redirecting to profile setup...');
        setTimeout(() => router.push('/register-profile'), 1500);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {isLogin ? 'Sign in to access your dashboard' : 'Join the Ukhwah Career Network'}
        </p>
      </div>

      {message && (
        <div className={`p-3 text-sm rounded-md ${message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            required 
            minLength={6}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div className="text-center mt-4">
        <button 
          type="button" 
          onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
          className="text-sm text-emerald-600 hover:underline"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}