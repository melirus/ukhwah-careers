'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Browse Jobs', href: '/jobs' },
    { name: 'My Applications', href: '/my-applications' },
    { name: 'Employer Portal', href: '/employer/applications' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/jobs" className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="bg-emerald-600 text-white p-1.5 rounded-lg text-sm">🌙</span>
              <span>Ukhwah Careers</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}