export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, className = "", action }) => {
  return (
    <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 border-t border-slate-100 bg-slate-50 ${className}`}>{children}</div>;
};
