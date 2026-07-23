'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface Application {
  id: string;
  created_at: string;
  cover_letter: string;
  status: string;
  jobs: {
    title: string;
  } | null;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Employer Profile Check States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [hasCompanyProfile, setHasCompanyProfile] = useState<boolean>(true);

  useEffect(() => {
    checkEmployerProfileAndFetchData();
  }, []);

  const checkEmployerProfileAndFetchData = async () => {
    setLoading(true);
    
    // 1. Check User Session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    // 2. Check if user has registered a company profile
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('employer_user_id', session.user.id)
      .limit(1);

    if (!company) {
      setHasCompanyProfile(false);
      setLoading(false);
      return;
    }

    setHasCompanyProfile(true);

    // 3. Fetch applications linked to employer's jobs
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id,
        created_at,
        cover_letter,
        status,
        jobs ( title )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setApplications(data as unknown as Application[]);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);

    const { data, error } = await supabase
      .from('job_applications')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (error) {
      alert(`Failed to update status: ${error.message}`);
    } else if (!data || data.length === 0) {
      alert('❌ Update failed: Row Level Security (RLS) blocked this change.');
    } else {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    }

    setUpdatingId(null);
  };

  // 🔒 State 1: User Not Logged In
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full text-2xl">🔑</div>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to Access Employer Portal</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Please log in with your employer account to review applicants and post jobs.
        </p>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // 📋 State 2: User Logged In BUT No Company Registered
  if (!hasCompanyProfile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="bg-amber-50 text-amber-600 p-3 rounded-full text-2xl">🏢</div>
        <h2 className="text-2xl font-bold text-slate-900">Register Your Company Profile</h2>
        <p className="text-slate-500 text-sm max-w-md">
          Before managing candidate applications or posting jobs, please complete your organization's setup profile.
        </p>
        <Link
            href="/employer/profile"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"        >
          Register Company Profile
        </Link>
      </div>
    );
  }

  // 🚀 State 3: Full Access Dashboard
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Quick Action Header with Post a Job Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Incoming Candidate Applications</h1>
            <p className="text-slate-500 text-sm">Review submitted pitches and manage applicant statuses.</p>
          </div>

          <Link
            href="/post-job"
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1 shrink-0"
          >
            <span>+</span> Post a New Job
          </Link>
        </div>

        {loading ? (
          <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-400 text-sm animate-pulse">
            Loading candidate submissions...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-500 text-sm">
            No candidate applications received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      {app.jobs?.title || 'Position Application'}
                    </span>
                    <p className="text-xs text-slate-400">
                      Submitted on {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      disabled={updatingId === app.id}
                      value={app.status || 'Submitted'}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Pitch Content */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">Cover Pitch:</h4>
                  <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line">
                    {app.cover_letter || 'No cover statement provided.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}