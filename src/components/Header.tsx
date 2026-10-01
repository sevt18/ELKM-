import React from 'react';
import { StudentProfile } from '../types';
import { formatCOP } from '../data/mockData';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: 'menu' | 'tracker' | 'orders' | 'inventory') => void;
  activeRole: 'student' | 'admin';
  onRoleChange: (role: 'student' | 'admin') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  user: StudentProfile;
  onOpenUserModal: () => void;
  pendingOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onRoleChange,
  cartCount,
  cartTotal,
  onOpenCart,
  user,
  onOpenUserModal,
  pendingOrdersCount,
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

  const navItems = [
    { id: 'menu' as const, label: 'Menú', icon: 'restaurant_menu', role: 'student' },
    { id: 'tracker' as const, label: 'Mis Pedidos', icon: 'receipt_long', role: 'student' },
    { id: 'orders' as const, label: 'Gestión', icon: 'storefront', badge: pendingOrdersCount, role: 'admin' },
    { id: 'inventory' as const, label: 'Inventario', icon: 'inventory_2', role: 'admin' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Top row / Left section on Desktop */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center p-1.5 shadow-md shrink-0 border border-slate-800">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M7 16C7 10 11 6 18 6C23 6 26 9 26 14C26 18 22 21 17 21H8" stroke="#008DDA" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 11C13 8 16 7 19 7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="15" cy="22" r="2.5" fill="#FFFFFF" />
                <path d="M11 20H23C23 25 19 28 15 28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider uppercase text-blue-700">Cafetería IUSH</span>
                <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-1.5 py-0.2 rounded uppercase">Campus</span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate leading-tight">
                {getTabTitle()}
              </h1>
            </div>
          </div>

          {/* Mobile Right Actions: Cart & User */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenCart}
              aria-label="Ver carrito"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all border border-slate-200"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenUserModal}
              title={`Perfil: ${user.name}`}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-xl active:scale-95 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-800 max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Desktop Central Navigation Links (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-xs">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={`material-symbols-outlined text-[17px] ${isActive ? 'filled text-blue-700' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-0.5 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Desktop Right Controls: Role Switcher, Cart & Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Role Switcher Pill */}
          <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center border border-slate-200/80 shadow-xs">
            <button
              onClick={() => onRoleChange('student')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'admin'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Cafetería / Admin</span>
            </button>
          </div>

          {/* Desktop Cart Button with Price preview */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 border border-slate-800"
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Mi Pedido</span>
            {cartTotal > 0 && (
              <span className="text-emerald-400 font-extrabold border-l border-slate-700 pl-2">
                {formatCOP(cartTotal)}
              </span>
            )}
          </button>

          {/* Desktop User Profile Button */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 px-3 py-1.5 rounded-xl transition active:scale-95"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">{user.name}</span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Saldo: <strong className="text-blue-700">{formatCOP(user.balance)}</strong>
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Second Row: Role Switcher (Shown ONLY on Mobile) */}
        <div className="md:hidden bg-slate-100/90 p-1 rounded-2xl flex items-center border border-slate-200/80 shadow-xs">
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
