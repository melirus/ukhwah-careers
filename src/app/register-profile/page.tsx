'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import ProfileForm from '../../components/candidate/ProfileForm';

export default function RegisterProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      // Fetch the active session from Supabase Auth
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // If no user is logged in, redirect them immediately to the login gateway
        router.push('/login');
      } else {
        // Set the authentic User UUID
        setUserId(session.user.id);
      }
      setLoading(false);
    };

    checkUserSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Verifying security token...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
            Ukhwah Career Network
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm">
            Empowering graduates from Islamic institutions into strategic growth sectors.
          </p>
        </div>
        
        {/* Pass the actual, authenticated database user ID down to the form */}
        {userId && <ProfileForm userId={userId} />}
      </div>
    </div>
  );
}