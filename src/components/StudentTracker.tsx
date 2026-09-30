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
  const [historyOpen, setHistoryOpen] = useState(false);
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
    <div className="space-y-4 pb-24">
      {/* Sub-Tabs: Menú y Pedir vs Rastreador */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-700 shadow-inner">
        <button
          onClick={onGoToMenu}
          className="flex-1 py-2 rounded-lg text-center transition text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
          <span>Menú y Pedir</span>
        </button>
        <button
          className="flex-1 py-2 rounded-lg text-center transition bg-white text-blue-700 shadow-sm flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span>Rastreador en Vivo</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      </div>

      {/* If No Active Order */}
      {!activeOrder ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[30px]">receipt_long</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">No tienes pedidos activos en curso</h3>
          <p className="text-xs text-slate-500 max-w-[260px] mx-auto">
            Explora el menú universitario de la cafetería, elige tus favoritos y retira sin hacer filas.
          </p>
          <button
            onClick={onGoToMenu}
            className="mt-2 py-2.5 px-5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Explorar Menú Cafetería
          </button>
        </div>
      ) : (
        <>
          {/* Active Order Ticket Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-5 shadow-lg border border-slate-800">
            {/* Ambient blur effects */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-amber-500/15 blur-xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white/15 text-white backdrop-blur-md">
                    {activeOrder.status === 'entregado' ? 'Pedido Entregado' : 'En Proceso Activo'}
                  </span>
                  {activeOrder.status !== 'entregado' && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-300">Hoy, {activeOrder.timestamp}</span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-wider text-blue-300">
                    Turno / Ticket Oficial
                  </p>
                  <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm font-mono">
                    #{activeOrder.id}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-medium">
                    Tiempo Estimado
                  </span>
                  <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-xl backdrop-blur-sm mt-0.5 font-bold text-xs">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span>{activeOrder.estimatedTime || '8 - 12 min'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-300 bg-white/5 -mx-5 -mb-5 px-5 py-2.5 border-t border-white/10">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[16px] text-blue-400">location_on</span>
                  <span>{activeOrder.pickupCounter || 'Mostrador Principal - Bloque Central'}</span>
                </span>
                <span className="font-semibold text-amber-300 shrink-0">
                  {activeOrder.approxTime || 'Aprox: 10:30 AM'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive 4-Phase Stepper Tracker */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Rastreo de Preparación
              </h3>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Fase {currentPhase} de 4
              </span>
            </div>

            <div className="relative flex flex-col space-y-4 pl-1">
              {/* Step 1: Recibido en Sistema */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`absolute left-3.5 top-8 -bottom-4 w-0.5 rounded-full z-0 ${
                    currentPhase >= 2 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                ></div>
                <div
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                    currentPhase >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">1. Recibido en Sistema</p>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                      {activeOrder.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pago validado y comanda transferida al panel de la cafetería
                  </p>
                </div>
              </div>

              {/* Step 2: En Preparación */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`absolute left-3.5 top-8 -bottom-4 w-0.5 rounded-full z-0 ${
                    currentPhase >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                ></div>
                <div
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                    currentPhase > 2
                      ? 'bg-emerald-500 text-white'
                      : currentPhase === 2
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {currentPhase > 2 ? 'check' : 'soup_kitchen'}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-bold ${
                        currentPhase === 2 ? 'text-blue-700' : currentPhase > 2 ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      2. En Preparación
                    </p>
                    {currentPhase === 2 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.2 rounded-full">
                        En Curso
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cocina y barra preparando tu orden con insumos frescos del día
                  </p>
                  {currentPhase === 2 && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Listo para Reclamar */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`absolute left-3.5 top-8 -bottom-4 w-0.5 rounded-full z-0 ${
                    currentPhase >= 4 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                ></div>
                <div
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                    currentPhase > 3
                      ? 'bg-emerald-500 text-white'
                      : currentPhase === 3
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-bounce'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {currentPhase > 3 ? 'check' : 'notifications_active'}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-bold ${
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
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.2 rounded-full animate-pulse">
                        ¡Pasa ya!
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {currentPhase > 3 ? 'Completado' : 'Pendiente'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Acércate a la ventanilla #2 con tu código para retirar tu bandeja
                  </p>
                </div>
              </div>

              {/* Step 4: Entregado */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                    currentPhase === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">handshake</span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-bold ${
                        currentPhase === 4 ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      4. Entregado
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {currentPhase === 4 ? 'Completado' : 'Paso Final'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Entrega verificada en el mostrador. ¡Buen provecho, Salazarista!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Pass & QR Ticket */}
          <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">
              Pase Rápido de Retiro
            </span>
            <p className="text-xs text-slate-600 max-w-[280px]">
              Presenta este código en la ventanilla de entrega cuando llamen tu número:
            </p>

            {/* Vector QR Graphic */}
            <div className="my-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block">
              <div className="w-32 h-32 bg-slate-900 rounded-xl p-2.5 flex flex-col justify-between items-center text-white">
                <div className="w-full flex justify-between">
                  <div className="w-7 h-7 border-2 border-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-xs"></div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <div className="w-1.5 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-7 h-7 border-2 border-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-xs"></div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 my-1">
                  <span className="material-symbols-outlined text-[18px] text-blue-400">local_cafe</span>
                  <span className="text-[10px] font-black tracking-widest text-white">IUSH</span>
                </div>

                <div className="w-full flex justify-between items-end">
                  <div className="w-7 h-7 border-2 border-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-xs"></div>
                  </div>
                  <div className="text-[9px] font-mono font-bold text-slate-300 tracking-wider">
                    #{activeOrder.id}
                  </div>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-white px-3.5 py-1 rounded-full border border-slate-200 shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-blue-700">person</span>
              <span>
                Titular: <strong>{activeOrder.studentName || user.name}</strong>
              </span>
            </div>
          </div>

          {/* Order Detailed Breakdown Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">receipt</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Detalle de tu Pedido
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                {activeOrder.items.length} {activeOrder.items.length === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>

            {/* Item list */}
            <div className="space-y-2">
              {activeOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">restaurant</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.quantity}x {item.name}
                      </h4>
                      <span className="text-xs font-bold text-blue-700 shrink-0">
                        {formatCOP(item.price * item.quantity)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions Note Box */}
            {activeOrder.note && (
              <div className="flex items-start gap-2 bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs">
                <span className="material-symbols-outlined text-[18px] text-blue-700 shrink-0 mt-0.5">
                  edit_note
                </span>
                <div>
                  <span className="font-bold text-blue-900 block text-[11px]">Nota para el cocinero:</span>
                  <p className="italic text-slate-700 mt-0.5">“{activeOrder.note}”</p>
                </div>
              </div>
            )}

            {/* Pricing breakdown */}
            <div className="pt-2 flex flex-col space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{formatCOP(activeOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>Descuento Tarjeta Estudiantil</span>
                  <span className="material-symbols-outlined text-[13px] text-amber-600">school</span>
                </span>
                <span className="font-medium text-emerald-700">-$0 COP</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 text-sm font-black text-slate-900 border-t border-slate-100">
                <span>Total Pagado</span>
                <span className="text-base text-blue-700">{formatCOP(activeOrder.total)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                  <span>{activeOrder.paymentMethod}</span>
                </span>
                <span>Aprobado (Trans. #98124)</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Accordion: Historial de Pedidos Anteriores */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">history</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Historial de Pedidos Anteriores</h4>
              <p className="text-[11px] text-slate-500">Consulta tus compras pasadas y vuelve a pedir</p>
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
          <div className="px-4 pb-4 space-y-2.5 border-t border-slate-100 pt-3">
            {pastOrders.map((po) => (
              <div
                key={po.id}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-mono">{po.id}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                      {po.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{po.summary}</p>
                  <span className="text-[11px] text-slate-400">
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

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onGoToMenu}
          className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          <span>Ver Menú / Hacer Nuevo Pedido</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowContactModal(true)}
            className="h-11 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-700">support_agent</span>
            <span>Contactar Mostrador</span>
          </button>

          <button
            onClick={handleSimulateAdvance}
            disabled={!activeOrder || activeOrder.status === 'entregado'}
            className="h-11 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-400">refresh</span>
            <span>Simular Avance</span>
          </button>
        </div>
      </div>

      {/* Contact Mostrador Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xs w-full p-4 shadow-2xl flex flex-col space-y-3 border border-slate-200">
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
            <p className="text-xs text-slate-600">
              ¿Tienes un cambio en tu orden o necesitas retirar con urgencia para entrar a tu clase?
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col space-y-1 text-xs">
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
