import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: 'menu' | 'tracker' | 'orders' | 'inventory') => void;
  pendingOrdersCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingOrdersCount,
}) => {
  const tabs = [
    {
      id: 'menu' as const,
      label: 'Menú',
      icon: 'restaurant_menu',
      role: 'student',
    },
    {
      id: 'tracker' as const,
      label: 'Mis Pedidos',
      icon: 'receipt_long',
      role: 'student',
    },
    {
      id: 'orders' as const,
      label: 'Gestión',
      icon: 'storefront',
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      role: 'admin',
    },
    {
      id: 'inventory' as const,
      label: 'Inventario',
      icon: 'inventory_2',
      role: 'admin',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all group ${
                isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform group-active:scale-90 ${
                    isActive ? 'filled scale-105 text-blue-700' : 'text-slate-500'
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-blue-700 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
