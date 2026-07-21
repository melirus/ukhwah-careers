import JobPostingForm from '../../components/employer/JobPostingForm';

export default function PostJobPage() {
  // Pulls data using the mock corporate entity UUID seeded into the DB previously
  const activeCompanyUuid = "22222222-2222-2222-2222-222222222222";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">Corporate Portal</h1>
          <p className="mt-1.5 text-slate-500 text-sm">Publish opportunities directly into the network stream.</p>
        </div>
        <JobPostingForm companyId={activeCompanyUuid} />
      </div>
    </div>
  );
}