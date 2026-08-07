import { Loader2 } from "lucide-react";

const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm z-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );
};

export default Loader;
