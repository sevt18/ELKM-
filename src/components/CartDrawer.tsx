import React, { useState } from 'react';
import { CartItem, StudentProfile } from '../types';
import { formatCOP, playAudioFeedback } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onConfirmOrder: (
    items: CartItem[],
    note: string,
    paymentMethod: 'Saldo IUSH' | 'Nequi' | 'Daviplata' | 'Efectivo en Caja',
    total: number
  ) => void;
  user: StudentProfile;
  onShowToast: (message: string, icon?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onConfirmOrder,
  user,
  onShowToast,
}) => {
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Saldo IUSH' | 'Nequi' | 'Daviplata' | 'Efectivo en Caja'>(
    'Saldo IUSH'
  );

  if (!isOpen) return null;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'Saldo IUSH' && user.balance < total) {
      playAudioFeedback(300, 0.2);
      onShowToast('Saldo IUSH insuficiente. Recarga o elige Nequi / Daviplata.', 'error');
      return;
    }

    playAudioFeedback(880, 0.18);
    onConfirmOrder(cart, note.trim(), paymentMethod, total);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-start md:flex-row md:justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      ></div>

      {/* Slide-Up Bottom Sheet on Mobile, Slide-In Drawer on Desktop */}
      <div className="relative bg-white w-full md:max-w-md h-auto max-h-[90vh] md:max-h-full md:h-full rounded-t-3xl md:rounded-t-none md:rounded-l-3xl shadow-2xl p-5 sm:p-6 flex flex-col border-t md:border-t-0 md:border-l border-slate-200 z-10 animate-in slide-in-from-bottom md:slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Tu Pedido Cafetería IUSH</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">Revisa tus productos y método de pago</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-[36px]">shopping_basket</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Tu carrito está vacío</h4>
              <p className="text-xs text-slate-500 max-w-[240px]">
                Explora el menú y agrega tus alimentos preferidos para realizar el pedido.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{product.name}</h5>
                        <span className="text-xs font-black text-blue-700">
                          {formatCOP(product.price * quantity)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                        <button
                          onClick={() => onUpdateQty(product.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-blue-700 font-black text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(product.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-blue-700 hover:text-blue-800 font-black text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kitchen Note Input */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notas o especificaciones para cocina:
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej: Sin cebolla, tostar bien el pan, ají aparte..."
                  className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-1 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Método de Pago:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Saldo IUSH')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition ${
                      paymentMethod === 'Saldo IUSH'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-blue-600">
                      credit_card
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate">Saldo IUSH</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        Disp: {formatCOP(user.balance)}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Nequi')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition ${
                      paymentMethod === 'Nequi'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-xs ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-purple-600">
                      account_balance_wallet
                    </span>
                    <span className="truncate">Nequi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Daviplata')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition ${
                      paymentMethod === 'Daviplata'
                        ? 'border-rose-600 bg-rose-50 text-rose-950 shadow-xs ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-rose-600">
                      smartphone
                    </span>
                    <span className="truncate">Daviplata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Efectivo en Caja')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition ${
                      paymentMethod === 'Efectivo en Caja'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-amber-600">
                      payments
                    </span>
                    <span className="truncate">Efectivo en Caja</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs sm:text-sm border border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalCount} productos)</span>
                  <span className="font-semibold text-slate-800">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Descuento Tarjeta Estudiantil IUSH</span>
                  <span className="font-bold text-emerald-700">-$0 COP</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm sm:text-base font-black text-slate-900">
                  <span>Total a Pagar</span>
                  <span className="text-base sm:text-lg text-blue-700">{formatCOP(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Action */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Confirmar y Enviar Pedido a Cafetería</span>
          </button>
        </div>
      </div>
    </div>
  );
};
