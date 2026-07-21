import { Job } from '@/types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Shariah Compliance Officer',
    companyName: 'Amanah Islamic Bank',
    location: 'Kuala Lumpur',
    employmentType: 'Full-time',
    requiresArabic: true,
    isHalalCertifiedRole: false,
    preferredSpecializations: ['Syariah', 'Islamic Finance'],
    salaryMin: 4500,
    salaryMax: 6000,
  },
  {
    id: '2',
    title: 'Halal Quality Assurance Executive',
    companyName: 'Thayyib Food Industries',
    location: 'Shah Alam',
    employmentType: 'Full-time',
    requiresArabic: false,
    isHalalCertifiedRole: true,
    preferredSpecializations: ['Halal Management', 'Food Science'],
    salaryMin: 3500,
    salaryMax: 4800,
  },
  {
    id: '3',
    title: 'Islamic Studies & Arabic Educator',
    companyName: 'Al-Hidayah International Academy',
    location: 'Bangi',
    employmentType: 'Contract',
    requiresArabic: true,
    isHalalCertifiedRole: false,
    preferredSpecializations: ['Usuluddin', 'Arabic Language'],
    salaryMin: 3000,
    salaryMax: 4000,
  }
];