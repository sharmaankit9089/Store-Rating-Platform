import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
            S
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-slate-600">Please sign in to your account</p>
        </div>
        
        <div className="rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
