import AuthForm from '../../../components/shared/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ukhwah Careers</h1>
      </div>
      <AuthForm />
    </div>
  );
}