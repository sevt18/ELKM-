import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle', visible }) => {
  if (!visible || !message) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 transform animate-in slide-in-from-top-4">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 text-white shadow-2xl border border-slate-800 backdrop-blur-md text-xs font-semibold max-w-sm">
        <span className="material-symbols-outlined text-[18px] text-blue-400 shrink-0">
          {icon}
        </span>
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
};
