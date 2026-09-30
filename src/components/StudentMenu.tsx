import React, { useState } from 'react';
import { ProductItem, CartItem, StudentProfile } from '../types';
import { formatCOP, playAudioFeedback } from '../data/mockData';

interface StudentMenuProps {
  products: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onOpenCart: () => void;
  onGoToTracker: () => void;
  user: StudentProfile;
  onRechargeBalance: () => void;
}

export const StudentMenu: React.FC<StudentMenuProps> = ({
  products,
  cart,
  onAddToCart,
  onOpenCart,
  onGoToTracker,
  user,
  onRechargeBalance,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'desayunos', label: '🍓 Desayunos' },
    { id: 'almuerzos', label: '🍲 Almuerzos' },
    { id: 'snacks', label: '🥟 Snacks' },
    { id: 'bebidas', label: '☕ Bebidas' },
    { id: 'promos', label: '🏷️ Promos IUSH' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'todos' ||
      (selectedCategory === 'promos' ? p.isPromo : p.category === selectedCategory);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleAdd = (p: ProductItem) => {
    if (!p.available) return;
    playAudioFeedback(600, 0.1);
    onAddToCart(p);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Sub-Tabs: Menú y Pedir vs Rastreador */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-700 shadow-inner">
        <button
          className="flex-1 py-2 rounded-lg text-center transition bg-white text-blue-700 shadow-sm flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
          <span>Menú y Pedir</span>
        </button>
        <button
          onClick={onGoToTracker}
          className="flex-1 py-2 rounded-lg text-center transition text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 relative"
        >
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span>Rastreador en Vivo</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      </div>

      {/* Hero Welcome Card: Salazarista Greeting & Saldo IUSH */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 text-white shadow-md border border-slate-800">
        <div className="flex items-start justify-between relative z-10 gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">
                IUSH Campus Medellín
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <h2 className="text-base font-extrabold tracking-tight">¡Hola, Salazarista! 👋</h2>
            <p className="text-xs text-slate-300 max-w-[210px] leading-tight">
              Pide en línea, evita filas y retira en el Bloque Central con tu código.
            </p>
          </div>

          {/* Saldo IUSH Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 text-right border border-white/15 shadow-sm flex flex-col items-end shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
              Saldo IUSH Pay
            </span>
            <span className="text-sm font-black text-white mt-0.5">{formatCOP(user.balance)}</span>
            <button
              onClick={onRechargeBalance}
              className="text-[10px] text-amber-300 hover:text-amber-200 font-bold underline mt-0.5 flex items-center gap-0.5"
            >
              <span>+ Recargar</span>
            </button>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3.5 text-slate-400 pointer-events-none text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar empanada, almuerzo, café, jugo..."
          className="w-full bg-white text-slate-900 text-xs pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-slate-400 hover:text-slate-700"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar text-xs font-semibold">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-700 text-white shadow-sm font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Section Header: Products count and Layout View Toggle */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-blue-700">restaurant</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {selectedCategory === 'todos' ? 'Menú Disponible IUSH' : `Categoría: ${selectedCategory}`}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'opción' : 'opciones'}
          </span>
          {/* Grid vs List toggle */}
          <div className="flex bg-slate-200 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              title="Vista cuadrícula"
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Vista lista"
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Display (Grid or List) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <span className="material-symbols-outlined text-[24px]">search_off</span>
          </div>
          <h4 className="text-xs font-bold text-slate-700">No encontramos productos en esta búsqueda</h4>
          <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto">
            Intenta con otro término como "empanada", "almuerzo" o selecciona otra categoría.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.product.id === p.id);
            return (
              <div
                key={p.id}
                className={`bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-sm flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-md ${
                  !p.available ? 'opacity-60 bg-slate-50' : ''
                }`}
              >
                {/* Product Image & Badges */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-100 mb-2 border border-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      // Fallback if network blocked
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {p.isPromo ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500 text-slate-950 shadow-sm">
                        Promo
                      </span>
                    ) : p.available ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-white/95 text-emerald-700 shadow-sm backdrop-blur-xs">
                        En Stock
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-600 text-white shadow-sm">
                        Agotado
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-blue-700">{formatCOP(p.price)}</span>
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={!p.available}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        !p.available
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : inCart
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-200 shadow-sm'
                          : 'bg-blue-700 text-white hover:bg-blue-800 active:scale-90 shadow-sm'
                      }`}
                      title={!p.available ? 'Agotado' : 'Agregar al pedido'}
                    >
                      {inCart ? (
                        <span className="text-[10px] font-bold">{inCart.quantity}</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode View (matching screenshot #5) */
        <div className="space-y-2.5">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.product.id === p.id);
            return (
              <div
                key={p.id}
                className={`bg-white rounded-xl p-3 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3 transition-all hover:border-slate-300 ${
                  !p.available ? 'opacity-60 bg-slate-50' : ''
                }`}
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                    {p.available ? (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                        Stock
                      </span>
                    ) : (
                      <span className="text-[9px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.2 rounded border border-rose-200">
                        Agotado
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                  <span className="text-xs font-extrabold text-blue-700 mt-1 block">
                    {formatCOP(p.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(p)}
                  disabled={!p.available}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    !p.available
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : inCart
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white hover:bg-blue-700 active:scale-95 shadow-sm'
                  }`}
                >
                  {inCart ? (
                    <span className="text-xs font-black">{inCart.quantity}</span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Bar: Ver mi orden / Carrito (Only shown when items exist or user is browsing) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-md mx-auto px-4 pb-2">
          <button
            onClick={onOpenCart}
            disabled={cartTotalItems === 0}
            className={`w-full py-3 px-4 rounded-xl shadow-xl flex items-center justify-between transition-all pointer-events-auto active:scale-[0.98] ${
              cartTotalItems > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-white ring-2 ring-blue-500/20'
                : 'bg-slate-800/90 text-slate-400 opacity-90'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-inner">
                {cartTotalItems}
              </div>
              <span className="text-xs font-bold text-white">Ver mi Pedido</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-emerald-400">
                {formatCOP(cartTotalPrice)}
              </span>
              <span className="material-symbols-outlined text-[18px] text-white">chevron_right</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
