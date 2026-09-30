import React from 'react';
import { StudentProfile } from '../types';
import { formatCOP, playAudioFeedback } from '../data/mockData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: StudentProfile;
  onSelectUser: (user: StudentProfile) => void;
  onRecharge: (amount: number) => void;
  onShowToast: (message: string, icon?: string) => void;
}

const PRESET_STUDENTS: StudentProfile[] = [
  {
    name: 'Santiago G.',
    email: 'santiago.gomez@soyiush.edu.co',
    program: 'Ingeniería de Sistemas',
    semester: 'Semestre 6',
    balance: 45000,
  },
  {
    name: 'Valentina Gómez',
    email: 'valentina.gomez@soyiush.edu.co',
    program: 'Ingeniería de Sistemas',
    semester: 'Semestre 6',
    balance: 32000,
  },
  {
    name: 'Mateo Calle',
    email: 'mateo.calle@soyiush.edu.co',
    program: 'Comunicación Social',
    semester: 'Semestre 5',
    balance: 28000,
  },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectUser,
  onRecharge,
  onShowToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Portal Estudiante IUSH</h3>
              <p className="text-[11px] text-slate-500">Credencial Salazarista Oficial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Current Active Account Box */}
        <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">
              Sesión Activa
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verificado
            </span>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">{user.name}</h4>
            <p className="text-xs text-blue-700 font-medium">{user.email}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              {user.program} • {user.semester}
            </p>
          </div>

          <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Saldo IUSH Pay</span>
              <span className="text-sm font-black text-blue-900">{formatCOP(user.balance)}</span>
            </div>
            <button
              onClick={() => {
                onRecharge(20000);
                playAudioFeedback(800, 0.12);
                onShowToast('¡Recarga de +$20.000 COP aplicada!', 'payments');
              }}
              className="py-1.5 px-3 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold rounded-xl shadow-xs active:scale-95 transition"
            >
              + $20.000 COP
            </button>
          </div>
        </div>

        {/* Switch Account */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Cambiar Cuenta Rápida:
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {PRESET_STUDENTS.map((st) => (
              <button
                key={st.email}
                onClick={() => {
                  onSelectUser(st);
                  onClose();
                  playAudioFeedback(600, 0.1);
                  onShowToast(`Sesión cambiada a ${st.name}`, 'person');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition ${
                  st.email === user.email
                    ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-950'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="font-bold block">{st.name}</span>
                  <span className="text-[10px] text-slate-500">{st.program}</span>
                </div>
                {st.email === user.email && (
                  <span className="material-symbols-outlined text-[16px] text-blue-700">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
