import React, { useState } from 'react';
import { Order, PastOrder, StudentProfile } from '../types';
import { formatCOP, playAudioFeedback } from '../data/mockData';

interface StudentTrackerProps {
  activeOrder: Order | null;
  pastOrders: PastOrder[];
  user: StudentProfile;
  onGoToMenu: () => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onReorder: (pastOrder: PastOrder) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const StudentTracker: React.FC<StudentTrackerProps> = ({
  activeOrder,
  pastOrders,
  user,
  onGoToMenu,
  onAdvanceOrderStatus,
  onReorder,
  onShowToast,
}) => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  const getPhaseNumber = (status?: string) => {
    switch (status) {
      case 'pendiente':
        return 1;
      case 'preparando':
        return 2;
      case 'listo':
        return 3;
      case 'entregado':
        return 4;
      default:
        return 1;
    }
  };

  const currentPhase = getPhaseNumber(activeOrder?.status);

  const handleSimulateAdvance = () => {
    if (!activeOrder) return;
    playAudioFeedback(780, 0.15);
    onAdvanceOrderStatus(activeOrder.id);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12">
      {/* Sub-Tabs: Menú y Pedir vs Rastreador en Vivo (Styled as sleek iOS/macOS segmented control) */}
      <div className="max-w-md mx-auto bg-slate-200/70 p-1 rounded-2xl flex items-center border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={onGoToMenu}
          className="flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl text-center text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/40 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-slate-500">restaurant</span>
          <span>Menú y Pedir</span>
        </button>
        <button
          type="button"
          className="flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl text-center bg-white text-blue-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-blue-600">schedule</span>
          <span>Rastreador en Vivo</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse shrink-0"></span>
        </button>
      </div>

      {/* If No Active Order */}
      {!activeOrder ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto shadow-inner">
            <span className="material-symbols-outlined text-[36px]">receipt_long</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">No tienes pedidos activos en curso</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Explora el menú universitario de la cafetería, elige tus favoritos y retira sin hacer filas.
          </p>
          <button
            onClick={onGoToMenu}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition active:scale-95"
          >
            Explorar Menú Cafetería
          </button>
        </div>
      ) : (
        /* Responsive 2-column Grid on Desktop: Left = Ticket + Stepper + QR; Right = Breakdown + History */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Active Order Ticket Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-slate-800">
              {/* Ambient blur effects */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"></div>
              <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-amber-500/15 blur-xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-white/15 text-white backdrop-blur-md">
                      {activeOrder.status === 'entregado' ? 'Pedido Entregado' : 'En Proceso Activo'}
                    </span>
                    {activeOrder.status !== 'entregado' && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-300">
                    Hoy, {activeOrder.timestamp}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <p className="text-xs uppercase font-extrabold tracking-wider text-blue-300">
                      Turno / Ticket Oficial
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm font-mono mt-0.5">
                      #{activeOrder.id}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-300 block font-bold">
                      Tiempo Estimado
                    </span>
                    <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-xl backdrop-blur-sm mt-1 font-black text-xs sm:text-sm">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{activeOrder.estimatedTime || '8 - 12 min'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 text-xs sm:text-sm text-slate-300 bg-white/5 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 py-3 border-t border-white/10">
                  <span className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[18px] text-blue-400">location_on</span>
                    <span>{activeOrder.pickupCounter || 'Mostrador Principal - Bloque Central'}</span>
                  </span>
                  <span className="font-bold text-amber-300 shrink-0">
                    {activeOrder.approxTime || 'Aprox: 10:30 AM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive 4-Phase Stepper Tracker */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                  Rastreo de Preparación en Cocina
                </h3>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Fase {currentPhase} de 4
                </span>
              </div>

              <div className="relative flex flex-col space-y-5 pl-1 pt-2">
                {/* Step 1: Recibido en Sistema */}
                <div className="flex items-start gap-3.5 relative">
                  <div
                    className={`absolute left-3.5 top-8 -bottom-5 w-0.5 rounded-full z-0 ${
                      currentPhase >= 2 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  ></div>
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                      currentPhase >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900">1. Recibido en Sistema</p>
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {activeOrder.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pago validado y comanda transferida al panel de la cafetería
                    </p>
                  </div>
                </div>

                {/* Step 2: En Preparación */}
                <div className="flex items-start gap-3.5 relative">
                  <div
                    className={`absolute left-3.5 top-8 -bottom-5 w-0.5 rounded-full z-0 ${
                      currentPhase >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  ></div>
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                      currentPhase > 2
                        ? 'bg-emerald-500 text-white'
                        : currentPhase === 2
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {currentPhase > 2 ? 'check' : 'soup_kitchen'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs sm:text-sm font-extrabold ${
                          currentPhase === 2 ? 'text-blue-700' : currentPhase > 2 ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        2. En Preparación
                      </p>
                      {currentPhase === 2 && (
                        <span className="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                          En Cocina
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cocina y barra preparando tu orden con insumos frescos del día
                    </p>
                    {currentPhase === 2 && (
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2.5">
                        <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Listo para Reclamar */}
                <div className="flex items-start gap-3.5 relative">
                  <div
                    className={`absolute left-3.5 top-8 -bottom-5 w-0.5 rounded-full z-0 ${
                      currentPhase >= 4 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  ></div>
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                      currentPhase > 3
                        ? 'bg-emerald-500 text-white'
                        : currentPhase === 3
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-bounce'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {currentPhase > 3 ? 'check' : 'notifications_active'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs sm:text-sm font-extrabold ${
                          currentPhase === 3
                            ? 'text-amber-800'
                            : currentPhase > 3
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        3. Listo para Reclamar
                      </p>
                      {currentPhase === 3 ? (
                        <span className="text-[10px] sm:text-xs font-extrabold text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full animate-pulse">
                          ¡Pasa ya!
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {currentPhase > 3 ? 'Completado' : 'Pendiente'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Acércate a la ventanilla #2 con tu código para retirar tu bandeja
                    </p>
                  </div>
                </div>

                {/* Step 4: Entregado */}
                <div className="flex items-start gap-3.5 relative">
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                      currentPhase === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs sm:text-sm font-extrabold ${
                          currentPhase === 4 ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        4. Entregado
                      </p>
                      <span className="text-xs text-slate-400">
                        {currentPhase === 4 ? 'Completado' : 'Paso Final'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Entrega verificada en el mostrador. ¡Buen provecho, Salazarista!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Pass & QR Ticket */}
            <div className="bg-slate-50 rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1">
                Pase Rápido de Retiro
              </span>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
                Presenta este código al barista o menciona tu nombre para reclamar sin filas:
              </p>

              {/* Vector QR Graphic */}
              <div className="my-4 p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block">
                <div className="w-36 h-36 bg-slate-950 rounded-xl p-3 flex flex-col justify-between items-center text-white">
                  <div className="w-full flex justify-between">
                    <div className="w-8 h-8 border-2 border-white rounded-md flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-white rounded-xs"></div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <div className="w-1.5 h-5 bg-white rounded-full"></div>
                    </div>
                    <div className="w-8 h-8 border-2 border-white rounded-md flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-white rounded-xs"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 my-1">
                    <span className="material-symbols-outlined text-[20px] text-blue-400">local_cafe</span>
                    <span className="text-xs font-black tracking-widest text-white">IUSH</span>
                  </div>

                  <div className="w-full flex justify-between items-end">
                    <div className="w-8 h-8 border-2 border-white rounded-md flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-white rounded-xs"></div>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">
                      #{activeOrder.id}
                    </div>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-bold bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <span className="material-symbols-outlined text-[18px] text-blue-700">person</span>
                <span>
                  Titular: <strong className="text-slate-900">{activeOrder.studentName || user.name}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            {/* Order Detailed Breakdown Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-700 text-[22px]">receipt</span>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                    Detalle de tu Pedido
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-bold">
                  {activeOrder.items.length} {activeOrder.items.length === 1 ? 'artículo' : 'artículos'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {activeOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">restaurant</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.quantity}x {item.name}
                        </h4>
                        <span className="text-xs sm:text-sm font-black text-blue-700 shrink-0">
                          {formatCOP(item.price * item.quantity)}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Kitchen Note */}
              {activeOrder.note && (
                <div className="flex items-start gap-2.5 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-xs sm:text-sm">
                  <span className="material-symbols-outlined text-[20px] text-blue-700 shrink-0 mt-0.5">
                    edit_note
                  </span>
                  <div>
                    <span className="font-extrabold text-blue-900 block text-xs">Nota para el cocinero:</span>
                    <p className="italic text-slate-700 mt-0.5">“{activeOrder.note}”</p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="pt-3 flex flex-col space-y-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{formatCOP(activeOrder.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>Descuento Tarjeta Estudiantil</span>
                    <span className="material-symbols-outlined text-[14px] text-amber-600">school</span>
                  </span>
                  <span className="font-bold text-emerald-700">-$0 COP</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-sm sm:text-base font-black text-slate-900 border-t border-slate-100">
                  <span>Total Pagado</span>
                  <span className="text-base sm:text-lg text-blue-700">{formatCOP(activeOrder.total)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">account_balance_wallet</span>
                    <span>{activeOrder.paymentMethod}</span>
                  </span>
                  <span>Aprobado (Trans. #98124)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onGoToMenu}
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                  <span>Ver Menú / Hacer Nuevo Pedido</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="h-10 sm:h-11 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px] text-blue-700">support_agent</span>
                    <span>Mostrador (Ext. 142)</span>
                  </button>

                  <button
                    onClick={handleSimulateAdvance}
                    disabled={activeOrder.status === 'entregado'}
                    className="h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px] text-amber-400">refresh</span>
                    <span>Simular Avance</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Past Orders Accordion Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Historial de Pedidos Anteriores</h4>
                    <p className="text-[11px] sm:text-xs text-slate-500">Consulta tus compras pasadas y vuelve a pedir</p>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${
                    historyOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {historyOpen && (
                <div className="px-4 sm:px-5 pb-5 space-y-2.5 border-t border-slate-100 pt-3">
                  {pastOrders.map((po) => (
                    <div
                      key={po.id}
                      className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 font-mono">{po.id}</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                            {po.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate mt-0.5">{po.summary}</p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {po.date} • {formatCOP(po.total)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onReorder(po);
                          onShowToast(`Combo ${po.id} agregado al pedido`, 'replay');
                        }}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition shrink-0 border border-blue-200 flex items-center gap-1 active:scale-95"
                        title="Repetir este pedido"
                      >
                        <span className="material-symbols-outlined text-[18px]">replay</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Mostrador Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col space-y-3.5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                <span>Mostrador Cafetería</span>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              ¿Tienes un cambio en tu orden o necesitas retirar con urgencia para entrar a tu clase?
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col space-y-1 text-xs">
              <span className="font-bold text-slate-900">
                Extensión Cafetería: <strong>Ext. 142</strong>
              </span>
              <span className="text-slate-500">Horario de atención: 6:30 AM - 8:30 PM</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setShowContactModal(false);
                  onShowToast('Llamada enrutada a Ext. 142', 'phone');
                }}
                className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold text-center rounded-xl shadow-sm transition"
              >
                Llamar Ahora
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
