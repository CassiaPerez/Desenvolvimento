import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-cyber-black/80 backdrop-blur-lg border-b border-brand-blue/30 sticky top-0 z-50">
      <div className="px-6 py-3 flex items-center justify-between text-xs font-display uppercase tracking-widest text-brand-blue/80 border-b border-brand-blue/10">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-blue pulse-indicator"></span>
            Saúde do Sistema: ATIVO
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-400">
            CPU: 24%
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-400">
            LAT: 12ms
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">database</span>
          NÓ_DB_04: SINCRONIZADO
        </div>
      </div>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded border border-brand-blue/50 bg-brand-blue/10">
             <span className="material-symbols-outlined text-brand-blue text-2xl">hub</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined text-brand-blue text-2xl">notifications_active</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-lavender rounded-full shadow-[0_0_8px_#D05CE3]"></span>
          </div>
          <div className="w-10 h-10 rounded-md border border-brand-blue/50 flex items-center justify-center bg-brand-blue/10 text-brand-blue font-display font-bold text-sm shadow-[inset_0_0_5px_rgba(0,207,255,0.2)]">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};