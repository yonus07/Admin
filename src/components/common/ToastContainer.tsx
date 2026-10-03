import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTournament();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
        let border = 'border-l-4 border-blue-500';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
          border = 'border-l-4 border-emerald-500';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
          border = 'border-l-4 border-amber-500';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
          border = 'border-l-4 border-red-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white rounded-xl shadow-card p-3.5 flex items-start gap-3 border border-gray-100 ${border} transition-all duration-300 animate-slide-in`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 leading-snug">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
