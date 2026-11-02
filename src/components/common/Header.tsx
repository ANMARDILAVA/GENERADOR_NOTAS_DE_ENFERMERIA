import React from 'react';
import { ModuleId } from '../../types/clinical';
import { ArrowLeft, ShieldCheck, HeartPulse, Settings } from 'lucide-react';

interface Props {
  activeModule: ModuleId;
  onNavigateMenu: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<Props> = ({
  activeModule,
  onNavigateMenu,
  onOpenAdmin,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
      {/* Brand Zone */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onNavigateMenu}
          className="flex items-center gap-3.5 text-left group transition cursor-pointer"
        >
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:bg-blue-700 transition">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-700 transition">
              Sistema Central de Notas
            </h1>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide mt-0.5">
              <span>GENERADOR ASISTENCIAL DE ENFERMERÍA</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Local / Privado
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-2.5 self-end sm:self-center">
        <button
          type="button"
          onClick={onOpenAdmin}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition shadow-xs cursor-pointer ${
            activeModule === 'admin'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200'
          }`}
          title="Panel de Control del Administrador"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Admin</span>
        </button>

        {activeModule !== 'menu' && (
          <button
            type="button"
            onClick={onNavigateMenu}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>
        )}
      </div>
    </header>
  );
};
