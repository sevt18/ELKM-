import React from 'react';
import { StudentProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  activeRole: 'student' | 'admin';
  onRoleChange: (role: 'student' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  user: StudentProfile;
  onOpenUserModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeRole,
  onRoleChange,
  cartCount,
  onOpenCart,
  user,
  onOpenUserModal,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'menu':
        return 'Menú Catálogo';
      case 'tracker':
        return 'Mis Pedidos';
      case 'orders':
        return 'Gestión Pedidos';
      case 'inventory':
        return 'Inventario';
      default:
        return 'Cafetería IUSH';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-md mx-auto px-4 pt-3 pb-2.5 flex flex-col gap-2.5">
        {/* Top row: Brand & Quick actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo + Titles */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Visual Logo container */}
            <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center p-1.5 shadow-sm shrink-0 border border-slate-800">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M7 16C7 10 11 6 18 6C23 6 26 9 26 14C26 18 22 21 17 21H8" stroke="#008DDA" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 11C13 8 16 7 19 7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="15" cy="22" r="2.5" fill="#FFFFFF" />
                <path d="M11 20H23C23 25 19 28 15 28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-700">Cafetería IUSH</span>
                <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-1.5 py-0.2 rounded uppercase">Campus</span>
              </div>
              <h1 className="text-sm font-extrabold text-slate-900 truncate leading-tight">{getTabTitle()}</h1>
            </div>
          </div>

          {/* Right actions: Cart & User profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart trigger button */}
            <button
              onClick={onOpenCart}
              aria-label="Ver carrito de compras"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all border border-slate-200/90"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User chip */}
            <button
              onClick={onOpenUserModal}
              title={`Perfil: ${user.name}`}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 px-2.5 py-1.5 rounded-xl active:scale-95 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-800 max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Second row: Role Switcher (Vista Estudiante vs Vista Administrador) */}
        <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center border border-slate-200/80 shadow-xs">
          <button
            onClick={() => onRoleChange('student')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>Vista Estudiante</span>
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Vista Cafetería / Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

