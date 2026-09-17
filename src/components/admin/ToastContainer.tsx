import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = usePortfolio();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded shadow-2xl border font-f1 font-bold text-xs tracking-wider text-white transition-all transform animate-slideUp ${
              isSuccess
                ? 'bg-[#151a16] border-[#00ff66]/40 text-[#00ff66]'
                : isWarning
                ? 'bg-[#1a1812] border-f1-yellow/40 text-f1-yellow'
                : 'bg-[#1a1214] border-f1-red/40 text-f1-red'
            }`}
          >
            {isSuccess && <CheckCircle2 size={16} />}
            {isWarning && <AlertTriangle size={16} />}
            {!isSuccess && !isWarning && <XCircle size={16} />}
            <span className="text-white">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
