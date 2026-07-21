export interface CandidateProfileInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  currentLocation: string;
  bio: string;
  arabicProficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic' | 'None';
  englishProficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
  isHafiz: boolean;
  juzMemorized: number;
  skillsTags: string[];
  
  // Initial Education History entries
  institutionName: string;
  educationLevel: string;
  facultyName: string;
  majorSpecialization: string;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  requiresArabic: boolean;
  isHalalCertifiedRole: boolean;
  preferredSpecializations: string[];
  salaryMin: number;
  salaryMax: number;
}