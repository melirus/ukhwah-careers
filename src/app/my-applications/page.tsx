'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Application {
  id: string;
  created_at: string;
  cover_letter: string;
  status: string;
  jobs: {
    title: string;
    location: string;
    employment_type: string;
    companies: {
      company_name: string;
    } | null;
  } | null;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserApplications();
  }, []);

  const fetchUserApplications = async () => {
    setLoading(true);

    // 1. Get the current logged-in user's session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      return;
    }

    // 2. Query applications matching candidate_id
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id,
        created_at,
        cover_letter,
        status,
        jobs (
          title,
          location,
          employment_type,
          companies ( company_name )
        )
      `)
      .eq('candidate_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setApplications(data as unknown as Application[]);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-bold">Shortlisted</span>;
      case 'Under Review':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold">Under Review</span>;
      case 'Rejected':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-md text-xs font-bold">Rejected</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold">Submitted</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 text-sm">Track real-time updates on your job applications.</p>
        </div>

        {loading ? (
          <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-400 text-sm animate-pulse">
            Fetching your application history...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-500 text-sm">
            You haven't submitted any job applications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{app.jobs?.title || 'Unknown Role'}</h3>
                    <p className="text-xs font-medium text-slate-500">
                      {app.jobs?.companies?.company_name || 'Ethical Corporation'} • {app.jobs?.location || 'Remote'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status || 'Submitted')}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-1">Your Submitted Cover Pitch:</h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    "{app.cover_letter || 'No pitch statement provided.'}"
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}