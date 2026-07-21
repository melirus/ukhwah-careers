'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CandidateProfileInput } from '@/types';

export default function ProfileForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState<CandidateProfileInput>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    currentLocation: '',
    bio: '',
    arabicProficiency: 'None',
    englishProficiency: 'Basic',
    isHafiz: false,
    juzMemorized: 0,
    skillsTags: [],
    institutionName: '',
    educationLevel: 'Bachelor Degree',
    facultyName: '',
    majorSpecialization: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Insert base candidate metadata into Supabase
      const { data: profile, error: profileError } = await supabase
        .from('candidate_profiles')
        .insert([{
          user_id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          current_location: formData.currentLocation,
          bio: formData.bio,
          arabic_proficiency: formData.arabicProficiency,
          english_proficiency: formData.englishProficiency,
          is_hafiz: formData.isHafiz,
          juz_memorized: formData.isHafiz ? formData.juzMemorized : 0,
          skills_tags: formData.skillsTags,
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Insert initial Islamic academic history row linked to the profile
      const { error: eduError } = await supabase
        .from('education_history')
        .insert([{
          profile_id: profile.id,
          institution_name: formData.institutionName,
          education_level: formData.educationLevel,
          faculty_name: formData.facultyName,
          major_specialization: formData.majorSpecialization,
          start_date: new Date().toISOString().split('T')[0],
        }]);

      if (eduError) throw eduError;

      setMessage('✨ Profile successfully registered! Welcome aboard.');
    } catch (error: any) {
      setMessage(`❌ Registration Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Professional Setup</h2>
        <p className="text-sm text-slate-500">Highlight your specialized background and Islamic university credentials.</p>
      </div>
      
      {message && (
        <div className={`p-4 rounded-md text-sm ${message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {message}
        </div>
      )}

      {/* Basic Contact Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">First Name</label>
          <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" 
            value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Last Name</label>
          <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" 
            value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
      </div>

      {/* Islamic & Language Credentials Block */}
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Madrasah / Core Academic Focus</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Arabic Level</label>
            <select className="w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={formData.arabicProficiency} onChange={e => setFormData({...formData, arabicProficiency: e.target.value as any})}>
              <option value="None">None</option>
              <option value="Basic">Basic / Readable</option>
              <option value="Intermediate">Intermediate (Conversational)</option>
              <option value="Professional">Professional (Corporate/Translational)</option>
              <option value="Fluent">Fluent Academic Speaker</option>
              <option value="Native">Native</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">University / Institute</label>
            <input required type="text" placeholder="e.g., IIUM, USIM, UniSHAMS, Al-Azhar" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={formData.institutionName} onChange={e => setFormData({...formData, institutionName: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Kulliyyah / Faculty</label>
            <input type="text" placeholder="e.g., Faculty of Islamic Contemporary Studies" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={formData.facultyName} onChange={e => setFormData({...formData, facultyName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Major Specialization</label>
            <input required type="text" placeholder="e.g., Syariah, Muamalat, Usuluddin, Quranic Studies" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={formData.majorSpecialization} onChange={e => setFormData({...formData, majorSpecialization: e.target.value})} />
          </div>
        </div>

        {/* Dynamic Hafiz Interface Segment */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              checked={formData.isHafiz} onChange={e => setFormData({...formData, isHafiz: e.target.checked})} />
            Are you a Hafiz / Hafizah?
          </label>

          {formData.isHafiz && (
            <div className="flex items-center gap-2 duration-200 transition-all">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Juz Memorized:</span>
              <input type="number" min="0" max="30" className="w-20 px-2 py-1 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                value={formData.juzMemorized} onChange={e => setFormData({...formData, juzMemorized: Math.min(30, Math.max(0, parseInt(e.target.value) || 0))})} />
            </div>
          )}
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-md shadow transition-colors text-sm disabled:opacity-50">
        {loading ? 'Submitting Application Data...' : 'Complete Profile Setup'}
      </button>
    </form>
  );
}