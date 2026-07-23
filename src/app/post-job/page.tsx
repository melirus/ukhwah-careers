'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function PostJobPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasCompanyProfile, setHasCompanyProfile] = useState<boolean>(false);

  useEffect(() => {
    checkAuthAndCompany();
  }, []);

  const checkAuthAndCompany = async () => {
    setLoading(true);

    // 1. Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    // 2. Check if user has registered a company
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('employer_user_id', session.user.id)
      .maybeSingle();

    if (company) {
      setHasCompanyProfile(true);
    } else {
      setHasCompanyProfile(false);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 text-sm animate-pulse">
        Checking employer credentials...
      </div>
    );
  }

  // 🔒 Guard 1: Not Logged In
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full text-2xl">🔒</div>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to Post a Job</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          You must be signed in with an employer account to publish job listings.
        </p>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
        >
          Sign In / Sign Up
        </Link>
      </div>
    );
  }

  // 🏢 Guard 2: Logged in, but no company profile yet
  if (!hasCompanyProfile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="bg-amber-50 text-amber-600 p-3 rounded-full text-2xl">🏢</div>
        <h2 className="text-2xl font-bold text-slate-900">Company Profile Required</h2>
        <p className="text-slate-500 text-sm max-w-md">
          Please register your company details before posting your first job listing.
        </p>
        <Link
          href="/employer/profile"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
        >
          Register Company Profile
        </Link>
      </div>
    );
  }

  // ✅ Authorized: Render your existing Job Posting Form below
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* YOUR EXISTING JOB FORM CODE GOES HERE */}
    </div>
  );
}