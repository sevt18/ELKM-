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
    <div className="space-y-5 pb-24 md:pb-12">
      {/* Sub-Tabs: Menú y Pedir vs Rastreador en Vivo (Styled as sleek iOS/macOS segmented control) */}
      <div className="max-w-md mx-auto bg-slate-200/70 p-1 rounded-2xl flex items-center border border-slate-200/80 shadow-xs">
        <button
          type="button"
          className="flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl text-center bg-white text-blue-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-blue-600">restaurant</span>
          <span>Menú y Pedir</span>
        </button>
        <button
          type="button"
          onClick={onGoToTracker}
          className="flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl text-center text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/40 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-slate-500">schedule</span>
          <span>Rastreador en Vivo</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse shrink-0"></span>
        </button>
      </div>

      {/* Hero Welcome Card: Salazarista Greeting & Saldo IUSH (Responsive Bento Banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 sm:p-7 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10 gap-4 sm:gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                IUSH Campus Medellín
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">Mostrador Abierto</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
              ¡Hola, Salazarista! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Disfruta tu descanso con lo mejor de la cafetería universitaria. Pide en línea con tu celular o computador, evita filas y retira en el Bloque Central con tu código de turno.
            </p>
          </div>

          {/* Saldo IUSH Pay Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-left md:text-right border border-white/15 shadow-inner flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 block">
                Saldo IUSH Pay
              </span>
              <span className="text-base sm:text-xl font-black text-white block mt-0.5 tracking-tight">
                {formatCOP(user.balance)}
              </span>
            </div>
            <button
              onClick={onRechargeBalance}
              className="py-1.5 px-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition active:scale-95 flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Recargar Saldo</span>
            </button>
          </div>
        </div>

        {/* Ambient background blur circles */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-6 -top-6 w-36 h-36 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Search Input Bar & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar empanada, almuerzo, café, jugo, postre..."
            className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-10 pr-9 py-2.5 sm:py-3 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm font-semibold">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 sm:py-2 rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Header: Products count and Layout View Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-blue-700">restaurant</span>
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
            {selectedCategory === 'todos' ? 'Menú Disponible IUSH' : `Categoría: ${selectedCategory}`}
          </h3>
          <span className="text-[11px] sm:text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'opción' : 'opciones'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200/90 p-0.5 rounded-xl border border-slate-300/60">
            <button
              onClick={() => setViewMode('grid')}
              title="Vista cuadrícula"
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Vista lista"
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Display: 100% Fluid Responsive Grid (1 col on mobile, 2 on sm, 3 on lg, 4 on xl!) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h4 className="text-sm font-bold text-slate-800">No encontramos productos en esta búsqueda</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Intenta con otro término como "empanada", "almuerzo", "café" o selecciona otra categoría.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.product.id === p.id);
            return (
              <div
                key={p.id}
                className={`group bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-blue-400 hover:shadow-xl ${
                  !p.available ? 'opacity-65 bg-slate-50' : ''
                }`}
              >
                {/* Product Image & Badges */}
                <div className="relative w-full aspect-4/3 sm:aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-150">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {p.isPromo ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow-md">
                        Promo
                      </span>
                    ) : p.available ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-white/95 text-emerald-800 shadow-md backdrop-blur-sm">
                        En Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-600 text-white shadow-md">
                        Agotado
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-700 transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    <span className="text-sm sm:text-base font-black text-blue-700">
                      {formatCOP(p.price)}
                    </span>
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={!p.available}
                      className={`h-9 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                        !p.available
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : inCart
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-200 shadow-sm'
                          : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-md shadow-blue-500/20'
                      }`}
                      title={!p.available ? 'Agotado' : 'Agregar al pedido'}
                    >
                      {inCart ? (
                        <>
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>{inCart.quantity} en carrito</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          <span>Pedir</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode: 1 col on mobile, 2 cols on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.product.id === p.id);
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between gap-3.5 transition-all hover:border-blue-400 hover:shadow-md ${
                  !p.available ? 'opacity-60 bg-slate-50' : ''
                }`}
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
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
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{p.name}</h4>
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
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                  <span className="text-xs sm:text-sm font-black text-blue-700 mt-1 block">
                    {formatCOP(p.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(p)}
                  disabled={!p.available}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    !p.available
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : inCart
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-950 text-white hover:bg-blue-600 active:scale-95 shadow-sm'
                  }`}
                >
                  {inCart ? (
                    <span className="text-xs font-black">{inCart.quantity}</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Bar for Mobile Only (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-md mx-auto px-4 pb-2">
          <button
            onClick={onOpenCart}
            disabled={cartTotalItems === 0}
            className={`w-full py-3 px-4 rounded-2xl shadow-2xl flex items-center justify-between transition-all pointer-events-auto active:scale-[0.98] ${
              cartTotalItems > 0
                ? 'bg-slate-950 hover:bg-slate-900 text-white ring-2 ring-blue-500/20'
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
