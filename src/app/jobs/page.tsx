'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Job {
  id: string;
  title: string;
  employment_type: string;
  workplace_type: string;
  location: string;
  salary_min: number;
  salary_max: number;
  requires_arabic: boolean;
  is_halal_certified_role: boolean;
  companies: {
    company_name: string;
  } | null;
}

export default function JobSearchPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArabic, setFilterArabic] = useState(false);
  const [filterHalal, setFilterHalal] = useState(false);

  // Modal State Hooks
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [appStatus, setAppStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLiveJobs = async () => {
      setLoading(true);
      
      let query = supabase
        .from('jobs')
        .select(`
          id, title, employment_type, workplace_type, location, salary_min, salary_max, requires_arabic, is_halal_certified_role,
          companies ( company_name )
        `)
        .eq('status', 'active');

      if (filterArabic) {
        query = query.eq('requires_arabic', true);
      }
      if (filterHalal) {
        query = query.eq('is_halal_certified_role', true);
      }

      const { data, error } = await query;

      if (!error && data) {
        setJobs(data as unknown as Job[]);
      }
      setLoading(false);
    };

    fetchLiveJobs();
  }, [filterArabic, filterHalal]);

  // Client-side quick text filter matching titles or company names
  const finalFilteredJobs = jobs.filter((job) => {
    const compName = job.companies?.company_name?.toLowerCase() || '';
    return job.title.toLowerCase().includes(searchQuery.toLowerCase()) || compName.includes(searchQuery.toLowerCase());
  });

  // Application Submission Handler
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    setAppStatus('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAppStatus('❌ You must be logged in to apply for positions.');
        return;
      }

      const { error } = await supabase
        .from('job_applications')
        .insert([{
          job_id: selectedJob.id,
          candidate_id: session.user.id,
          cover_letter: coverLetter
        }]);

      if (error) {
        if (error.code === '23505') throw new Error('You have already applied to this position.');
        throw error;
      }

      setAppStatus('✨ Application successfully submitted!');
      setTimeout(() => {
        setSelectedJob(null);
        setCoverLetter('');
        setAppStatus('');
      }, 2000);
    } catch (err: any) {
      setAppStatus(`❌ Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse Opportunities</h1>
          <p className="text-slate-500 text-sm">Find roles tailored for Madrasah and Islamic University graduates.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <input 
            type="text"
            placeholder="Search by job title or company name..."
            className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Sidebar Filter Panel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Specialized Filters</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  checked={filterArabic}
                  onChange={(e) => setFilterArabic(e.target.checked)}
                />
                Requires Arabic Capability
              </label>

              <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  checked={filterHalal}
                  onChange={(e) => setFilterHalal(e.target.checked)}
                />
                Halal Executive Roles
              </label>
            </div>
          </div>

          {/* Job Listings Feed */}
          <div className="md:grid md:col-span-3 space-y-4">
            {loading ? (
              <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-400 text-sm animate-pulse">
                Querying live marketplace listings...
              </div>
            ) : finalFilteredJobs.length === 0 ? (
              <div className="bg-white p-8 text-center border border-slate-200 rounded-xl text-slate-500 text-sm">
                No active postings match your search filters right now.
              </div>
            ) : (
              finalFilteredJobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-950 hover:text-emerald-600 cursor-pointer">{job.title}</h2>
                    <p className="text-sm font-medium text-slate-600">
                      {job.companies?.company_name || 'Ethical Corporation'} • <span className="text-slate-400">{job.location} ({job.workplace_type})</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">{job.employment_type}</span>
                      {job.requires_arabic && <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">Arabic Required</span>}
                      {job.is_halal_certified_role && <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">Halal Compliance</span>}
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                    <p className="text-sm font-bold text-slate-900">RM {job.salary_min} - RM {job.salary_max}</p>
                    <p className="text-xs text-slate-400">per month</p>
                    <button 
                      type="button" 
                      onClick={() => setSelectedJob(job)}
                      className="mt-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-4 rounded text-xs transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Reactive Submission Overlay Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Apply for {selectedJob.title}</h3>
              <p className="text-xs text-slate-500">Submitting application to {selectedJob.companies?.company_name || 'Ethical Corporation'}</p>
            </div>

            {appStatus && (
              <div className={`p-3 text-xs rounded-md ${appStatus.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {appStatus}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Pitch / Cover Statement</label>
                <textarea 
                  required 
                  rows={4} 
                  placeholder="Summarize your language training, major background values alignment, or relevant field experience..."
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button 
                  type="button" 
                  className="px-4 py-2 text-xs font-medium border text-slate-600 rounded-md hover:bg-slate-50"
                  onClick={() => { setSelectedJob(null); setAppStatus(''); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}