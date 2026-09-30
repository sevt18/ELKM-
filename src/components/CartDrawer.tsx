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
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      ></div>

      {/* Slide-Up Drawer */}
      <div className="relative bg-white w-full max-w-md mx-auto rounded-t-3xl shadow-2xl p-5 max-h-[85vh] flex flex-col border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tu Pedido Cafetería</h3>
              <p className="text-[11px] text-slate-500">Revisa tus productos y método de pago</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {cart.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-[32px]">shopping_basket</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Tu carrito está vacío</h4>
              <p className="text-[11px] text-slate-500 max-w-[220px]">
                Explora el menú y agrega tus alimentos preferidos para realizar el pedido.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{product.name}</h5>
                        <span className="text-[11px] text-blue-700 font-bold">
                          {formatCOP(product.price * quantity)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQty(product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-blue-700 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-blue-700 hover:text-blue-800 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
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
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Notas o especificaciones para cocina:
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej: Sin cebolla, tostar bien el pan, ají aparte..."
                  className="w-full bg-slate-50 text-xs text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-1 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Método de Pago:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Saldo IUSH')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition ${
                      paymentMethod === 'Saldo IUSH'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-blue-600">
                      credit_card
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate">Saldo IUSH</span>
                      <span className="text-[10px] text-emerald-600 font-semibold block">
                        Disp: {formatCOP(user.balance)}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Nequi')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition ${
                      paymentMethod === 'Nequi'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-purple-600">
                      account_balance_wallet
                    </span>
                    <span className="truncate">Nequi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Daviplata')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition ${
                      paymentMethod === 'Daviplata'
                        ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-rose-600">
                      smartphone
                    </span>
                    <span className="truncate">Daviplata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Efectivo en Caja')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition ${
                      paymentMethod === 'Efectivo en Caja'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-amber-600">
                      payments
                    </span>
                    <span className="truncate">Efectivo en Caja</span>
                  </button>
                </div>
              </div>

              {/* Summary box */}
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs border border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalCount} productos)</span>
                  <span className="font-semibold text-slate-800">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Descuento Tarjeta Estudiantil IUSH</span>
                  <span className="font-bold text-emerald-700">-$0 COP</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total a Pagar</span>
                  <span className="text-base text-blue-700">{formatCOP(total)}</span>
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
            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Confirmar y Enviar Pedido a Cafetería</span>
          </button>
        </div>
      </div>
    </div>
  );
};
