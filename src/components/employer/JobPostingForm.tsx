'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function JobPostingForm({ companyId }: { companyId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('On-site');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [requiresArabic, setRequiresArabic] = useState(false);
  const [isHalalCertified, setIsHalalCertified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Insert new active vacancy row straight into public.jobs table
      const { error } = await supabase
        .from('jobs')
        .insert([{
          company_id: companyId,
          title,
          description,
          employment_type: employmentType,
          workplace_type: workplaceType,
          location,
          salary_min: parseFloat(salaryMin) || 0,
          salary_max: parseFloat(salaryMax) || 0,
          requires_arabic: requiresArabic,
          is_halal_certified_role: isHalalCertified,
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 30 days
        }]);

      if (error) throw error;

      setMessage('✨ Vacancy posted successfully to the live public feed!');
      // Reset text fields upon success
      setTitle('');
      setDescription('');
      setLocation('');
      setSalaryMin('');
      setSalaryMax('');
      setRequiresArabic(false);
      setIsHalalCertified(false);
    } catch (error: any) {
      setMessage(`❌ Posting Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Post a Vacancy</h2>
        <p className="text-sm text-slate-500">Connect with qualified talent across specialized ethical and professional domains.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md text-sm ${message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {message}
        </div>
      )}

      {/* Primary Particulars */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Job Title / Designation</label>
          <input required type="text" placeholder="e.g., Shariah Compliance Executive, Halal Auditor" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" 
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Role Description</label>
          <textarea required rows={4} placeholder="Detail core responsibilities, key daily deliverables, and target departmental goals..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>

      {/* Logistics & Compensation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Employment Type</label>
          <select className="w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Workplace Arrangement</label>
          <select className="w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={workplaceType} onChange={e => setWorkplaceType(e.target.value)}>
            <option>On-site</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Location City</label>
          <input required type="text" placeholder="e.g., Kuala Lumpur, Cyberjaya"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={location} onChange={e => setLocation(e.target.value)} />
        </div>
      </div>

      {/* Compensation Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Minimum Base Salary (RM/mo)</label>
          <input required type="number" placeholder="e.g., 4000"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={salaryMin} onChange={e => setSalaryMin(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Maximum Base Salary (RM/mo)</label>
          <input required type="number" placeholder="e.g., 6500"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={salaryMax} onChange={e => setSalaryMax(e.target.value)} />
        </div>
      </div>

      {/* Niche Requirements Grid */}
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Compliance & Skill Identifiers</h3>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              checked={requiresArabic} onChange={e => setRequiresArabic(e.target.checked)} />
            Requires Functional Arabic Capability
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              checked={isHalalCertified} onChange={e => setIsHalalCertified(e.target.checked)} />
            Core Halal Executive Function
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-md shadow transition-colors text-sm disabled:opacity-50">
        {loading ? 'Publishing Vacancy Content...' : 'Publish Position'}
      </button>
    </form>
  );
}